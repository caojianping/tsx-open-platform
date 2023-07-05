/***
 * @file:
 * @author: caojianping
 * @Date: 2023-07-05 19:34:14
 */

import { DingdingScanTypeEnum, OpenPlatformTypeEnum } from '../enums';
import { IDingdingScanResult, IDingdingShareParams } from './dingding.interface';
import { IFeishuScanResult } from './feishu.interface';

/**
 * 开放平台window类型
 */
export type PlatformWindow = Record<string, any> & { dd?: any; h5sdk?: any; tt?: any };

/**
 * 开放平台选项接口
 */
export interface IOpenPlatformOptions {
  // 扩展字段：签名地址
  signatureUrl: string;
}

/**
 * 开放平台链接地址接口
 */
export interface IOpenPlatformUrl {
  // 敏桥业务编号
  agAppId: string;

  // 各个平台编号
  [key: string]: string;
}

/**
 * 开放平台接口
 */
export interface IOpenPlatform {
  // 开放平台类型
  type: OpenPlatformTypeEnum;

  // 具体平台对应的app编号：飞书appId；钉钉corpId；
  key: string;

  // 敏桥业务编号
  agAppId: string;

  // 是否准备就绪
  isReady: boolean;

  // 配置选项
  options: IOpenPlatformOptions | null;

  /**
   * 初始化
   * @param options 初始化参数选项
   */
  init(options?: IOpenPlatformOptions): Promise<boolean>;

  /**
   * 授权码
   */
  authCode(): Promise<IBaseAuthCode>;

  /**
   * 扫码
   * @param type 扫码类型
   * @param barCodeInput 是否支持手动输入条形码
   */
  scanCode(
    type?: DingdingScanTypeEnum | string[],
    barCodeInput?: boolean
  ): Promise<IDingdingScanResult | IFeishuScanResult>;

  /**
   * 分享
   */
  share(shareParams: IDingdingShareParams, debugFlag?: boolean): Promise<any>;
}

/**
 * 开放平台授权码接口
 */
export interface IBaseAuthCode {
  // 授权码
  code: string;

  // 敏桥业务编号
  agAppId: string;
}
