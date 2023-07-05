/***
 * @file:
 * @author: caojianping
 * @Date: 2022-04-08 10:18:08
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
});
