/*
 * @Author: simonyang
 * @Date: 2022-04-18 19:48:51
 * @LastEditTime: 2022-06-06 19:50:03
 * @LastEditors: simonyang
 * @Description:
 */
export * from './toDisplayString'
export const extend = Object.assign

export const EMPTY_OBJ = {}

export function isObject(val) {
  return val !== null && typeof val === 'object'
}

export function isString(val) {
  return typeof val === 'string'
}

export function hasChanged(val, newValue) {
  return !Object.is(val, newValue)
}
export const hasOwn = (val, key) =>
  Object.prototype.hasOwnProperty.call(val, key)

export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : ''
  })
}

export const capitalize = (str: string) => {
  return str[0].toUpperCase() + str.slice(1)
}

export const toHandlerKey = (str: string) => {
  return str ? 'on' + capitalize(str) : ''
}
