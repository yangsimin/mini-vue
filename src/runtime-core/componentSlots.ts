import { ShapeFlags } from '../shared/ShapeFlags'

/*
 * @Author: simonyang
 * @Date: 2022-05-25 09:31:41
 * @LastEditTime: 2022-05-25 11:32:51
 * @LastEditors: simonyang
 * @Description:
 */
export function initSlots(instance, children) {
  const { vnode } = instance
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots)
  }
}

function normalizeObjectSlots(children: any, slots: any) {
  for (const key in children) {
    const value = children[key]
    slots[key] = props => normalizeSlotValue(value(props))
  }
}

function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value]
}
