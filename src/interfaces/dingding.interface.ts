/***
 * @file:
 * @author: caojianping
 * @Date: 2023-07-05 19:34:14
 */

import { DingdingShareTypeEnum } from '../enums';
import { IBaseAuthCode } from './platform.interface';

/**
 * 钉钉鉴权信息接口
 */
export interface IDingdingSignature {
  // 微应用ID
  agentId: string;

  // 企业ID
  corpId: string;

  // 生成签名的时间戳
  timeStamp: string;

  // 自定义固定字符串
  nonceStr: string;

  // 签名
  signature: string;
}

/**
 * 钉钉授权码结果接口
 */
export interface IDingdingAuthResult extends IBaseAuthCode {}

/**
 * 钉钉扫码结果接口
 */
export interface IDingdingScanResult {
  // 扫码内容
  text: string;
}

/**
 * 钉钉分享传参接口
 */
export interface IDingdingShareParams {
  /** 底部弹窗bar的主视角设置 **/
  controlMainParams?: {
    show: true; //控制按钮显示， true 显示， false 隐藏， 默认true
    control: true; //是否控制点击事件，true 控制，false 不控制， 默认false
    showIcon: true; //是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准
  };

  //分享类型
  type: DingdingShareTypeEnum;

  // 分享url
  url: string;

  // 分享内容
  content: string;

  // 分享标题
  title: string;

  // 分享图片
  image: string;
}
