/*
 * @Author: simonyang
 * @Date: 2022-04-19 16:41:33
 * @LastEditTime: 2022-06-06 19:56:35
 * @LastEditors: simonyang
 * @Description: 
 */
// mini-vue 出口
export * from './runtime-dom'

import { baseCompile } from './compiler-core/src'
import * as runtimeDom from './runtime-dom'
import { registerRuntimeCompiler } from './runtime-dom'

function compileToFunction(template) {
  const { code } = baseCompile(template)
  const render = new Function('Vue', code)(runtimeDom)
  return render
}

registerRuntimeCompiler(compileToFunction)
