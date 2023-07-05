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

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { OpenPlatformFactory, DingdingScanTypeEnum, IOpenPlatform } from '../../../src/index';

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
        (async () => {
          const status = await instance.init();
          if (status) {
            await authCode();
          }
        })();
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
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
