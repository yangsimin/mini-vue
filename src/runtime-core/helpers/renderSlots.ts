import { createVNode, Fragment } from '../vnode'

/*
 * @Author: simonyang
 * @Date: 2022-05-25 10:51:53
 * @LastEditTime: 2022-05-26 08:36:16
 * @LastEditors: simonyang
 * @Description:
 */
export function renderSlots(slots, name, props) {
  const slot = slots[name]
  if (slot) {
    if (typeof slot === 'function') {
      return createVNode(Fragment, {}, slot(props))
    }
  }
}
