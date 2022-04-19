/*
 * @Author: simonyang
 * @Date: 2022-04-19 10:07:59
 * @LastEditTime: 2022-04-19 11:41:51
 * @LastEditors: simonyang
 * @Description:
 */

import { hasChanged, isObject } from '../shared'
import { isTracking, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'

class RefImpl {
  private _value: any
  public dep
  private _rawValue: any
  constructor(value) {
    this._rawValue = value
    this._value = convert(value)
    this.dep = new Set()
  }

  get value() {
    trackRefValue(this)
    return this._value
  }
  set value(newValue) {
    if (!hasChanged(this._rawValue, newValue)) return

    this._rawValue = newValue
    this._value = convert(newValue)
    // 一定先修改值, 再通知
    triggerEffects(this.dep)
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value
}

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}
export function ref(value) {
  return new RefImpl(value)
}
