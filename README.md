# tsx-open-platform

open-platform开放平台集成SDK，封装了各大平台jsapi通用方法，目前包含了钉钉、飞书等平台。

## 安装

Using npm:

```bash
$ npm install tsx-open-platform
```

Using yarn:

```bash
$ yarn add tsx-open-platform
```

Using pnpm:

```bash
$ pnpm add tsx-open-platform
```

## API
### 1. 相关接口
文件：platform.interface.ts
```ts
/**
 * 开放平台选项接口
 */
export interface IOpenPlatformOptions {
  // 扩展字段：签名地址
  signatureUrl: string;
}

/**
 * 开放平台接口
 */
export interface IOpenPlatform {
  // 开放平台类型
  type: OpenPlatformTypeEnum;

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
   * @param isHash 页面是否为哈希方式
   */
  authCode(isHash?: boolean): Promise<string>;

  /**
   * 扫码
   * @param type 扫码类型
   * @param barCodeInput 是否支持手动输入条形码
   */
  scanCode(
    type?: DingdingScanTypeEnum | string[],
    barCodeInput?: boolean
  ): Promise<IDingdingScanResult | IFeishuScanResult>;
}
```

文件：dingding.interface.ts
```ts
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
export interface IDingdingAuthResult {
  // 授权码
  code: string;
}

/**
 * 钉钉扫码结果接口
 */
export interface IDingdingScanResult {
  // 扫码内容
  text: string;
}
```

文件：feishu.interface.ts
```ts
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
```

### 2. 相关枚举
```ts
/**
 * 开放平台类型枚举
 */
export const enum OpenPlatformTypeEnum {
  // 钉钉
  Dingding = 0,

  // 飞书
  Feishu = 1,
}

/**
 * 钉钉扫码类型枚举
 */
export const enum DingdingScanTypeEnum {
  // 全部
  All = 'all',

  // 二维码
  QrCode = 'qrCode',

  // 条形码
  BarCode = 'barCode',
}
```

## 示例
public.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>

    <!-- 钉钉jsapi_sdk -->
    <script src="https://g.alicdn.com/dingding/dingtalk-jsapi/2.13.42/dingtalk.open.js"></script>
    <!-- 飞书jsapi_sdk -->
    <script type="text/javascript" src="https://lf1-cdn-tos.bytegoofy.com/goofy/lark/op/h5-js-sdk-1.5.15.js"></script>
    <!-- 备注：如果所有平台的jssdk引入都开放时，那么工厂创建方法需要指定平台枚举：new OpenPlatformFactory().getInstance(OpenPlatformTypeEnum.Dingding) -->
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

```html
<template>
  <div>
    <h1>开放平台功能测试</h1>
    <p>
      <button @click="authCode">获取应用的免登授权码</button>
    </p>
    <p>
      <button @click="scanCode">调用扫码功能</button>
    </p>
  </div>
</template>
```

```ts
import { defineComponent, onMounted } from 'vue';
import { OpenPlatformFactory, DingdingScanTypeEnum, IOpenPlatform } from '@agilines/open-platform';

export default defineComponent({
  name: 'App',
  components: {},
  setup() {
    const openPlatformNames = ['钉钉平台', '飞书平台'];

    let openPlatform: IOpenPlatform | null = null;

    onMounted(() => {
      // 钉钉调用测试
      const factory = new OpenPlatformFactory();
      console.log('onMounted factory:', factory);
      // const instance: IOpenPlatform | null = factory.getInstance(OpenPlatformTypeEnum.Dingding);
      const instance: IOpenPlatform | null = factory.getInstance();
      console.log('onMounted instance:', instance);
      if (instance) {
        instance.init();
      }

      openPlatform = instance;
    });

    /**
     * 授权码
     */
    const authCode = async () => {
      try {
        const result = await openPlatform?.authCode();
        alert(`
          授权码调用平台：${openPlatformNames[openPlatform?.type || 0]}\r\n
          授权码调用结果：${JSON.stringify(result, null, 2)}
        `);
      } catch (error: any) {
        alert('error：' + JSON.stringify(error, null, 2));
      }
    };

    /**
     * 扫码
     */
    const scanCode = async () => {
      try {
        const result = await openPlatform?.scanCode(DingdingScanTypeEnum.All);
        alert(`
          扫码调用平台：${openPlatformNames[openPlatform?.type || 0]}\r\n
          扫码调用结果：${JSON.stringify(result, null, 2)}
        `);
      } catch (error: any) {
        alert('error：' + JSON.stringify(error, null, 2));
      }
    };

    return { authCode, scanCode };
  },
});
```

## 内网穿透工具
### 1. 钉钉
```bash
$ npm install dingtalk-design-cli@latest -g
$ ding ngrok --subdomain xyz --port 8080
```
详细使用方式见：https://open.dingtalk.com/document/resourcedownload/http-intranet-penetration
