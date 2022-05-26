import { createVNode } from '../vnode'

/*
 * @Author: simonyang
 * @Date: 2022-05-25 10:51:53
 * @LastEditTime: 2022-05-25 11:22:45
 * @LastEditors: simonyang
 * @Description:
 */
export function renderSlots(slots, name, props) {
  const slot = slots[name]
  if (slot) {
    if (typeof slot === 'function') {
      return createVNode('div', {}, slot(props))
    }
  }
}
