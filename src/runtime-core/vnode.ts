/*
 * @Author: simonyang
 * @Date: 2022-04-19 15:54:28
 * @LastEditTime: 2022-04-19 15:54:29
 * @LastEditors: simonyang
 * @Description:
 */
export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
  }
  return vnode
}
