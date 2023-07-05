/***
 * @file:
 * @author: caojianping
 * @Date: 2023-07-05 19:34:14
 */

import { resolveUrl } from '../utils';
import { DingdingScanTypeEnum, OpenPlatformTypeEnum } from '../enums';
import {
  PlatformWindow,
  IOpenPlatform,
  IOpenPlatformOptions,
  IDingdingScanResult,
  IDingdingSignature,
  IDingdingAuthResult,
  IDingdingShareParams,
} from '../interfaces';

/**
 * 钉钉开放平台业务实现类
 */
export class DingdingOpenPlatformService implements IOpenPlatform {
  // 钉钉实例
  private dd: any = null;

  // 开放平台类型：钉钉
  public type = OpenPlatformTypeEnum.Dingding;

  // 具体平台对应的app编号
  public key = 'corpId';

  // 敏桥业务编号
  public agAppId: string = '';

  // 钉钉是否准备就绪
  public isReady = false;

  // 钉钉配置选项
  public options: IOpenPlatformOptions | null = null;

  // 钉钉企业编号
  // 备注：corpId通过统一的配置链接获取，类似于：http://pcp-dev.agilines.cn:82/subapp/h5?corpId=####
  private corpId: string = '';

  /**
   * 构造函数
   * @returns void
   */
  constructor() {
    const dd = (window as PlatformWindow)['dd'];
    if (!dd) return;

    this.dd = dd;
    const url = resolveUrl(this.key);
    this.agAppId = url.agAppId;
    this.corpId = url[this.key];
  }

  /**
   * 初始化钉钉
   * PS：钉钉部分jsapi需要先鉴权才能调用
   * @param options 钉钉选项
   */
  public init(options?: IOpenPlatformOptions): Promise<boolean> {
    const self = this;
    self.options = options || null;

    const _readyAndError = (resolve: any, reject: any) => {
      // 准备
      self.dd.ready(() => {
        console.log('Dingding ready!');
        self.isReady = true;
        return resolve(true);
      });

      // 错误
      self.dd.error((err: any) => {
        console.log('Dingding err:', err);
        self.isReady = false;
        return reject(err);
      });
    };

    return new Promise((resolve: any, reject: any) => {
      if (options && options.signatureUrl) {
        // jsapi鉴权
        fetch(options.signatureUrl)
          .then((response: any) => response.json())
          .then((data: IDingdingSignature) => {
            // 配置
            self.dd.config({
              agentId: data.agentId,
              corpId: data.corpId,
              timeStamp: data.timeStamp,
              nonceStr: data.nonceStr,
              signature: data.signature,
              jsApiList: ['runtime.info', 'runtime.permission.requestAuthCode', 'biz.util.scan'],
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
  public authCode(): Promise<IDingdingAuthResult> {
    if (!this.isReady) throw new Error('Dingding is not ready!');

    const corpId = this.corpId;
    const agAppId = this.agAppId;
    return new Promise((resolve: any, reject: any) => {
      this.dd.runtime.permission.requestAuthCode({
        corpId,
        onSuccess: (data: any) => {
          data.agAppId = agAppId;
          resolve(data as IDingdingAuthResult);
        },
        onFail: (err: any) => reject(err),
      });
    });
  }

  /**
   * 钉钉扫码
   * @param type 扫码类型
   * @param barCodeInput 是否支持手动输入条形码
   * @returns 返回扫码结果数据
   */
  public scanCode(type?: DingdingScanTypeEnum, barCodeInput?: boolean): Promise<IDingdingScanResult> {
    if (!this.isReady) throw new Error('Dingding is not ready!');

    return new Promise((resolve: any, reject: any) => {
      this.dd.biz.util.scan({
        type: type || DingdingScanTypeEnum.All,
        onSuccess: (data: any) => resolve(data as IDingdingScanResult),
        onFail: (err: any) => reject(err),
      });
    });
  }

  /**
   * 钉钉分享
   * @param shareParams 分享设置需要传递的参数
   * @param debugFlag 是否为debug模式 true可以规避isReady的检测机制
   */
  public share(shareParams: IDingdingShareParams, debugFlag?: boolean): Promise<any> {
    if (!debugFlag) {
      if (!this.isReady) throw new Error('Dingding is not ready!');
    }
    return new Promise((resolve: any, reject: any) => {
      this.dd.biz.navigation.setRight({
        show: shareParams.controlMainParams ? shareParams.controlMainParams.show : true, //控制按钮显示， true 显示， false 隐藏， 默认true
        control: shareParams.controlMainParams ? shareParams.controlMainParams.control : true, //是否控制点击事件，true 控制，false 不控制， 默认false
        showIcon: shareParams.controlMainParams ? shareParams.controlMainParams.showIcon : true, //是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准
        onSuccess: () => {
          //如果control为true，则onSuccess将在发生按钮点击事件被回调
          this.dd.biz.util.share({
            type: shareParams.type, //分享类型，0:全部组件 默认； 1:只能分享到钉钉；2:不能分享，只有刷新按钮
            url: shareParams.url, // 分享url
            content: shareParams.content, // 分享内容
            title: shareParams.title, // 分享标题
            image: shareParams.image, // 分享图片
            onSuccess: (data: any) => resolve(data), // 分享成功回调
            onFail: (err: any) => reject(err), // 分享失败回调
          });
        },
        onFail: (err: any) => reject(err),
      });
    });
  }
}
