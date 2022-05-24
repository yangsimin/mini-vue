import { render } from './render'
import { createVNode } from './vnode'

/*
 * @Author: simonyang
 * @Date: 2022-04-19 15:51:14
 * @LastEditTime: 2022-05-24 10:52:34
 * @LastEditors: simonyang
 * @Description:
 */
export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // 先将根节点转成 vnode
      const vnode = createVNode(rootComponent)
      render(vnode, rootContainer)
    },
  }
}
