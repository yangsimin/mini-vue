/*
 * @Author: simonyang
 * @Date: 2022-04-18 19:48:51
 * @LastEditTime: 2022-05-24 15:39:02
 * @LastEditors: simonyang
 * @Description:
 */
export const extend = Object.assign

export function isObject(val) {
  return val !== null && typeof val === 'object'
}

export function hasChanged(val, newValue) {
  return !Object.is(val, newValue)
}
export const hasOwn = (val, key) =>
  Object.prototype.hasOwnProperty.call(val, key)
