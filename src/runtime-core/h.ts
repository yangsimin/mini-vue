/*
 * @Author: simonyang
 * @Date: 2022-04-19 16:57:40
 * @LastEditTime: 2022-04-19 16:57:41
 * @LastEditors: simonyang
 * @Description:
 */
import { createVNode } from './vnode'

export function h(type, props?, children?) {
  return createVNode(type, props, children)
}
