/*
 * @Author: simonyang
 * @Date: 2022-04-18 14:43:10
 * @LastEditTime: 2022-04-19 10:58:41
 * @LastEditors: simonyang
 * @Description:
 */
import { extend } from '../shared'

let activeEffect
let shouldTrack
class ReactiveEffect {
  private _fn: any
  isActive = true
  deps: Array<Set<ReactiveEffect>> = []
  onStop?: () => void

  constructor(fn) {
    this._fn = fn
  }
  run() {
    if (!this.isActive) {
      return this._fn()
    }

    shouldTrack = true
    activeEffect = this
    // 调用_fn() -> Proxy.get() -> track()
    const result = this._fn()
    shouldTrack = false

    return result
  }
  stop() {
    if (this.isActive) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.isActive = false
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })

  effect.deps.length = 0
}

const targetMap = new WeakMap()
export function track(target, key) {
  if (!isTracking()) return

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
  trackEffects(dep)
}

export function trackEffects(dep) {
  if (dep.has(activeEffect)) return

  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)

  triggerEffects(dep)
}

export function triggerEffects(dep) {
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

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn)
  extend(_effect, options)

  _effect.run()

  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect

  return runner
}
