/*
 * @Author: simonyang
 * @Date: 2022-04-18 20:13:32
 * @LastEditTime: 2022-04-19 14:22:17
 * @LastEditors: simonyang
 * @Description:
 */

import { extend, isObject } from '../shared'
import { track, trigger } from './effect'
import { reactive, readonly, ReactiveFlags } from './reactive'

// 缓存 get/set 函数，避免每次都重新创建函数
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, isShallow = false) {
  return function get(target, key) {
    // 用于判断 isReactive()
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    const res = Reflect.get(target, key)

    if (isShallow) {
      return res
    }

    if (!isReadonly) {
      track(target, key)
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value)

    trigger(target, key)
    return res
  }
}

export const mutableHandlers = {
  get,
  set,
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`key:${key} set 失败 因为 target 是 readonly`, target)
    return true
  },
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
})
