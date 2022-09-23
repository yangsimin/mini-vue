/*
 * @Author: simonyang
 * @Date: 2022-04-18 14:43:10
 * @LastEditTime: 2022-04-19 14:53:18
 * @LastEditors: simonyang
 * @Description:
 */
import { extend } from '../shared'

let activeEffect
let shouldTrack
export class ReactiveEffect {
  private _fn: any
  deps = []
  isActive = true
  onStop?: () => void
  public scheduler: Function | undefined

  constructor(fn, scheduler?: Function) {
    this._fn = fn
    this.scheduler = scheduler
  }
  run() {
    if (!this.isActive) {
      // 调用过 stop() 时
      return this._fn()
    }

    shouldTrack = true
    activeEffect = this
    // 调用_fn() -> Proxy.get() -> track()
    const result = this._fn()
    // 重置
    shouldTrack = false
    activeEffect = undefined

    return result
  }
  // 取消响应式
  stop() {
    // isActive 标记符为了在多次重复调用stop()时提高性能
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
    targetMap.set(target, (depsMap = new Map()))
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }

  // dep：用于存放依赖 target 对象的 key 属性的 ReactiveEffect（持有对应函数的引用）
  trackEffects(dep)
}

export function trackEffects(dep) {
  // 已经订阅过，则跳过
  if (dep.has(activeEffect)) return

  dep.add(activeEffect)

  // deps：指该 ReactiveEffect 所使用到的响应式变量的所有相关 ReactiveEffect
  activeEffect.deps.push(dep)
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) return

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

  // 调用函数，触发 track 收集依赖
  _effect.run()

  // 由于 runner 要 return 出去，需要维持 runner 中的 this 指向
  const runner: any = _effect.run.bind(_effect)

  // 将 effect 引用绑定到 runner 上，方便调用 stop(runner)
  runner.effect = _effect

  return runner
}
