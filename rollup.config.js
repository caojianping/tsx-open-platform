import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import path from 'path';
import { eslint } from 'rollup-plugin-eslint';
import { terser } from 'rollup-plugin-terser';
import rollupTs from 'rollup-plugin-typescript2';
import pkg from './package.json';

// 名称
const name = pkg.buildOptions.name || 'OpenPlatform';
const fname = pkg.name;

// 依赖
const deps = Object.keys(pkg.dependencies);

// 横幅标语
const banner = `/*!
   * ${pkg.name} v${pkg.version}
   * (c) ${new Date().getFullYear()} ${pkg.author}
   * @license MIT
   */`;

// 格式化配置
const formatConfig = {
  cjs: 'common',
  es: 'esm',
  'es.browser': 'esm.browser',
  umd: 'umd',
};

// 基础配置集合
const baseConfigs = [{ format: 'umd', name }, { format: 'es' }, { format: 'es', browser: true }, { format: 'cjs' }];

// 扩展配置集合
const extendConfigs = (() => {
  const result = [];
  baseConfigs.forEach((config) => {
    const format = formatConfig[config.format + (!!config.browser ? '.browser' : '')];
    result.push(
      Object.assign({}, config, {
        file: resolvePath(`./dist/${fname}.${format}.js`),
        // sourcemap: true,
        sourcemap: false,
        minify: false,
      })
    );
    result.push(
      Object.assign({}, config, {
        file: resolvePath(`./dist/${fname}.${format}.min.js`),
        sourcemap: false,
        minify: true,
      })
    );
  });
  return result;
})();

/**
 * 解析路径
 * @param {*} _path 路径
 * @returns path
 */
function resolvePath(_path) {
  return path.resolve(__dirname, _path);
}

/**
 * 创建入口信息
 * @param {*} config 配置
 * @returns 入口信息
 */
function createEntry(config) {
  const entry = {
    input: resolvePath('./src/index.ts'),
    plugins: [
      json(),
      resolve({ preferBuiltins: false }),
      commonjs(),
      eslint({
        throwOnError: true,
        include: ['src/**/*.ts'],
        exclude: ['node_modules/**', 'dist/**'],
      }),
      rollupTs({
        useTsconfigDeclarationDir: true,
        tsconfig: resolvePath('./tsconfig.json'),
        extensions: ['.js', '.ts', '.tsx'],
      }),
    ],
    external: deps,
    output: {
      banner,
      file: config.file,
      format: config.format,
      sourcemap: config.sourcemap,
      globals: (() => {
        const result = {};
        deps.forEach((item) => {
          result[item] = item;
        });
        return result;
      })(),
      exports: 'named',
    },
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg);
      }
    },
  };
  if (config.format === 'umd') {
    entry.output.name = config.name;
  }
  if (config.minify) {
    entry.plugins.push(terser({ module: config.format === 'es' }));
  }
  return entry;
}

export default extendConfigs.map((config) => createEntry(config));
