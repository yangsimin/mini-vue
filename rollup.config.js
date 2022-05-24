/*
 * @Author: simonyang
 * @Date: 2022-04-19 16:41:06
 * @LastEditTime: 2022-05-24 11:49:17
 * @LastEditors: simonyang
 * @Description:
 */
import pkg from './package.json'
import typescript from '@rollup/plugin-typescript'
export default {
  input: './src/index.ts',
  output: [
    // 1. cjs -> commonjs
    {
      format: 'cjs',
      file: pkg.main,
    },
    // 2. esm
    {
      format: 'es',
      file: pkg.module,
    },
  ],
  plugins: [typescript()],
}
