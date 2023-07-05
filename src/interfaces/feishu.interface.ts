/***
 * @file:
 * @author: caojianping
 * @Date: 2023-07-05 19:34:14
 */

import { DingdingShareTypeEnum } from '../enums';
import { IBaseAuthCode } from './platform.interface';

/**
 * 飞书鉴权信息接口
 */
export interface IFeishuSignature {
  // 应用ID
  appId: string;

  // 生成签名的时间戳
  timestamp: string;

  // 自定义固定字符串
  nonceStr: string;

  // 签名
  signature: string;
}

/**
 * 飞书扫码结果接口
 */
export interface IFeishuScanResult {
  // 扫码结果
  result: string;

  // 错误消息
  errMsg: string;
}

/**
 * 飞书授权码结果接口
 */
export interface IFeishuAuthResult extends IBaseAuthCode {}

/**
 * 飞书分享传参接口
 */
export interface IFeishuShareParams {
  // 分享类型
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
