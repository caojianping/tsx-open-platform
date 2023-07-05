/***
 * @file:
 * @author: caojianping
 * @Date: 2023-07-05 19:34:14
 */

/**
 * 开放平台类型枚举
 */
export enum OpenPlatformTypeEnum {
  // 钉钉
  Dingding = 0,

  // 飞书
  Feishu = 1,
}

/**
 * 钉钉扫码类型枚举
 */
export enum DingdingScanTypeEnum {
  // 全部
  All = 'all',

  // 二维码
  QrCode = 'qrCode',

  // 条形码
  BarCode = 'barCode',
}

/**
 * 钉钉分享类型枚举
 */
export enum DingdingShareTypeEnum {
  // 全部组件
  SHARE_ALL,

  // 分享到钉钉
  SHARE_CURRENT_PAGE,

  // 不能分享
  NO_SHARE,
}
