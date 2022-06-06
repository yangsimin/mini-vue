/*
 * @Author: simonyang
 * @Date: 2022-06-06 14:22:53
 * @LastEditTime: 2022-06-06 14:46:59
 * @LastEditors: simonyang
 * @Description:
 */
export const TO_DISPLAY_STRING = Symbol('toDisplayString')
export const CREATE_ELEMENT_VNODE = Symbol('createElementVNode')

export const helperMapName = {
  [TO_DISPLAY_STRING]: 'toDisplayString',
  [CREATE_ELEMENT_VNODE]: 'createElementVNode'
}
