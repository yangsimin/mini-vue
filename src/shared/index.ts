/*
 * @Author: simonyang
 * @Date: 2022-04-18 19:48:51
 * @LastEditTime: 2022-04-19 11:06:33
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
