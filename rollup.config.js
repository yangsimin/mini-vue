/*
 * @Author: simonyang
 * @Date: 2022-04-19 16:41:06
 * @LastEditTime: 2022-04-19 17:15:27
 * @LastEditors: simonyang
 * @Description:
 */
import pkg from './package.json'
import typescript from '@rollup/plugin-typescript'
export default {
  input: './src/index.ts',
  output: [
    // 1. cjs -> commonjs
    // 2. esm
    {
      format: 'cjs',
      file: pkg.main,
    },
    {
      format: 'es',
      file: pkg.module,
    },
  ],
  plugins: [typescript()],
}
