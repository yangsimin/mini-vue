import { createVNode } from './vnode'

/*
 * @Author: simonyang
 * @Date: 2022-04-19 15:51:14
 * @LastEditTime: 2022-05-27 14:13:18
 * @LastEditors: simonyang
 * @Description:
 */
export function createAppAPI(render) {
  return function createApp(rootComponent) {
    return {
      mount(rootContainer) {
        // 先将根节点转成 vnode
        const vnode = createVNode(rootComponent)
        render(vnode, rootContainer)
      },
    }
  }
}
