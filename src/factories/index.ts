/***
 * @file:
 * @author: caojianping
 * @Date: 2023-07-05 19:34:14
 */

import { OpenPlatformTypeEnum } from '../enums';
import { PlatformWindow, IOpenPlatform } from '../interfaces';
import { DingdingOpenPlatformService, FeishuOpenPlatformService } from '../services';

/**
 * 开放平台工厂
 */
export class OpenPlatformFactory {
  // 开放平台集合
  private platforms: Map<OpenPlatformTypeEnum, IOpenPlatform> = new Map();

  /**
   * 构造函数
   */
  constructor() {
    const data: IOpenPlatform[] = [new DingdingOpenPlatformService(), new FeishuOpenPlatformService()];
    data.forEach((item: IOpenPlatform) => {
      this.platforms.set(item.type, item);
    });
  }

  /**
   * 获取开放平台类型
   * PS：根据windows挂载的对象自动判断当前平台类型
   * @returns 返回开放平台类型
   */
  private getPlatformType(): OpenPlatformTypeEnum {
    const cwindows: PlatformWindow = window as PlatformWindow;
    if (cwindows?.dd) return OpenPlatformTypeEnum.Dingding;
    else if (cwindows?.h5sdk) return OpenPlatformTypeEnum.Feishu;
    else throw new Error('Unknown platform!');
  }

  /**
   * 获取开放平台服务实例
   * @param type 开放平台类型
   * @returns 返回平台服务实例
   */
  public getInstance(type?: OpenPlatformTypeEnum): IOpenPlatform | null {
    const platformType = type === undefined ? this.getPlatformType() : type;
    const currentPlatformIns = this.platforms.get(platformType) || null;
    return currentPlatformIns;
  }
}
