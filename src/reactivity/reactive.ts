/*
 * @Author: simonyang
 * @Date: 2022-04-18 14:32:44
 * @LastEditTime: 2022-05-24 15:13:46
 * @LastEditors: simonyang
 * @Description:
 */

import { isObject } from '../shared/index'
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from './baseHandlers'

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers)
}

export function shallowReadonly(raw) {
  return createActiveObject(raw, shallowReadonlyHandlers)
}

export function isReactive(value) {
  return !!(value && value[ReactiveFlags.IS_REACTIVE])
}

export function isReadonly(value) {
  return !!(value && value[ReactiveFlags.IS_READONLY])
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value)
}

function createActiveObject(target: any, baseHandlers) {
  if (!isObject(target)) {
    console.warn(`target ${target} must be an object`)
    return target
  }
  // FIXME 有个 bug：如果已经是响应式对象，可以直接 return 出去，避免嵌套
  return new Proxy(target, baseHandlers)
}
