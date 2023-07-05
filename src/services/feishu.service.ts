/***
 * @file:
 * @author: caojianping
 * @Date: 2023-07-05 19:34:14
 */

import { resolveUrl } from '../utils';
import { OpenPlatformTypeEnum } from '../enums';
import {
  PlatformWindow,
  IOpenPlatform,
  IOpenPlatformOptions,
  IFeishuSignature,
  IFeishuScanResult,
  IFeishuAuthResult,
  IFeishuShareParams,
} from '../interfaces';

/**
 * 飞书开放平台业务实现类
 */
export class FeishuOpenPlatformService implements IOpenPlatform {
  // 飞书h5sdk实例
  private h5sdk: any = null;

  // 飞书tt实例
  private tt: any = null;

  // 开放平台类型：飞书
  public type = OpenPlatformTypeEnum.Feishu;

  // 具体平台对应的app编号
  public key = 'appId';

  // 敏桥业务编号
  public agAppId: string = '';

  // 飞书是否准备就绪
  public isReady = false;

  // 飞书配置选项
  public options: IOpenPlatformOptions | null = null;

  // 飞书应用编号
  // 备注：appId通过统一的配置链接获取，类似于：http://pcp-dev.agilines.cn:82/subapp/h5?appId=####
  private appId: string = '';

  /**
   * 构造函数
   * @returns void
   */
  constructor() {
    const cwindows: PlatformWindow = window as PlatformWindow;
    const { h5sdk, tt } = cwindows;
    if (!h5sdk || !tt) return;

    this.h5sdk = h5sdk;
    this.tt = tt;
    const url = resolveUrl(this.key);
    this.agAppId = url.agAppId;
    this.appId = url[this.key];
  }

  /**
   * 初始化飞书
   * PS：飞书jsapi必须先鉴权才能调用
   * @param options 飞书选项
   */
  public init(options?: IOpenPlatformOptions): Promise<boolean> {
    const self = this;
    self.options = options || null;

    const _readyAndError = (resolve: any, reject: any) => {
      // 准备
      self.h5sdk.ready(() => {
        console.log('Feishu ready!');
        self.isReady = true;
        return resolve(true);
      });

      // 错误
      self.h5sdk.error((err: any) => {
        console.log('Feishu err:', err);
        self.isReady = false;
        return reject(err);
      });
    };

    return new Promise((resolve: any, reject: any) => {
      if (options && options.signatureUrl) {
        // jsapi鉴权
        fetch(options.signatureUrl)
          .then((response: any) => response.json())
          .then((data: IFeishuSignature) => {
            this.appId = data.appId;
            // 配置
            self.h5sdk.config({
              appId: data.appId,
              timestamp: data.timestamp,
              nonceStr: data.nonceStr,
              signature: data.signature,
              jsApiList: [],
            });

            _readyAndError(resolve, reject);
          })
          .catch((err: any) => reject(err));
      } else {
        _readyAndError(resolve, reject);
      }
    });
  }

  /**
   * 授权码
   * @returns 返回授权码
   */
  public authCode(): Promise<IFeishuAuthResult> {
    if (!this.isReady) throw new Error('Feishu is not ready!');

    const appId = this.appId;
    const agAppId = this.agAppId;
    return new Promise((resolve: any, reject: any) => {
      this.tt.requestAuthCode({
        appId,
        success: (info: IFeishuAuthResult) => {
          info.agAppId = agAppId;
          resolve(info as IFeishuAuthResult);
        },
        fail: (error: any) => reject(error),
      });
    });
  }

  /**
   * 飞书扫码
   * @param type 扫码类型
   * @param barCodeInput 是否支持手动输入条形码
   * @returns 返回扫码结果数据
   */
  public scanCode(type?: string[], barCodeInput?: boolean): Promise<IFeishuScanResult> {
    if (!this.isReady) throw new Error('Feishu is not ready!');

    return new Promise((resolve: any, reject: any) => {
      this.tt.scanCode({
        scanType: type || ['barCode', 'qrCode'],
        barCodeInput: barCodeInput || false,
        success: (data: any) => resolve(data as IFeishuScanResult),
        fail: (err: any) => reject(err),
      });
    });
  }

  /**
   * 飞书分享
   * @param shareParams 分享设置需要传递的参数
   * @param debugFlag 是否为debug模式 true可以规避isReady的检测机制
   */
  public share(shareParams: IFeishuShareParams, debugFlag?: boolean): Promise<any> {
    if (!debugFlag) {
      if (!this.isReady) throw new Error('Feishu is not ready!');
    }

    return new Promise((resolve: any, reject: any) => {
      this.tt.share({
        channelType: ['system'],
        contentType: 'url',
        title: shareParams.title,
        url: shareParams.url,
        image: shareParams.image,
        success: (data: any) => resolve(data),
        fail: (err: any) => reject(err),
      });
    });
  }
}
