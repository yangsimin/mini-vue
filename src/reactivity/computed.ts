/*
 * @Author: simonyang
 * @Date: 2022-04-19 13:03:05
 * @LastEditTime: 2022-04-19 13:41:09
 * @LastEditors: simonyang
 * @Description:
 */

import { createDep } from './dep'
import { ReactiveEffect } from './effect'
import { trackRefValue, triggerRefValue } from './ref'

class ComputedRefImpl {
  public dep: any
  public effect: ReactiveEffect

  private _dirty: boolean
  private _value: any

  constructor(getter) {
    this._dirty = true
    this.dep = createDep()
    this.effect = new ReactiveEffect(getter, () => {
      if (this._dirty) return

      this._dirty = true
      triggerRefValue(this)
    })
  }

  get value() {
    trackRefValue(this)

    if (this._dirty) {
      this._dirty = false
      this._value = this.effect.run()
    }
    return this._value
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter)
}
