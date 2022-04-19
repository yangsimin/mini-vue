import { render } from './render'
import { createVNode } from './vnode'

/*
 * @Author: simonyang
 * @Date: 2022-04-19 15:51:14
 * @LastEditTime: 2022-04-19 15:57:05
 * @LastEditors: simonyang
 * @Description:
 */
export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      const vnode = createVNode(rootComponent)
      render(vnode, rootContainer)
    },
  }
}
