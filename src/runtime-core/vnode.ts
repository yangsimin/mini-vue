/*
 * @Author: simonyang
 * @Date: 2022-04-19 15:54:28
 * @LastEditTime: 2022-04-19 21:50:37
 * @LastEditors: simonyang
 * @Description:
 */
import { ShapeFlags } from '../shared/ShapeFlags'
export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    shapeFlag: getShapeFlag(type),
    el: null,
  }
  if (typeof children === 'string') {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }
  return vnode
}
function getShapeFlag(type: any) {
  return typeof type === 'string'
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT
}
