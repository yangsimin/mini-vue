/*
 * @Author: simonyang
 * @Date: 2022-04-18 14:43:10
 * @LastEditTime: 2022-04-18 19:55:46
 * @LastEditors: simonyang
 * @Description:
 */
import { extend } from '../shared'

class ReactiveEffect {
  private _fn: any
  private active = true
  deps: Array<Set<ReactiveEffect>> = []
  onStop?: () => void

  constructor(fn) {
    this._fn = fn
  }
  run() {
    activeEffect = this
    // 调用_fn() -> Proxy.get() -> track()
    return this._fn()
  }
  stop() {
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
}

const targetMap = new Map()
export function track(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  if (!activeEffect) return

  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

export function stop(runner) {
  runner.effect.stop()
}

let activeEffect
export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn)
  extend(_effect, options)

  _effect.run()

  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect

  return runner
}
