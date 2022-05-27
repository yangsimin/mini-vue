import { getCurrentInstance } from './component'

/*
 * @Author: simonyang
 * @Date: 2022-05-27 10:30:31
 * @LastEditTime: 2022-05-27 11:36:21
 * @LastEditors: simonyang
 * @Description:
 */
export function provide(key, value) {
  // 存
  const currentInstance: any = getCurrentInstance()

  if (currentInstance) {
    let { provides } = currentInstance
    const parentProvides = currentInstance.parent.provides

    if (provides === parentProvides) {
      provides = currentInstance.provides = Object.create(provides)
    }
    provides[key] = value  
  }
}
export function inject(key, defaultValue) {
  // 取
  const currentInstance: any = getCurrentInstance()

  if (currentInstance) {
    const parentProvides = currentInstance.parent.provides

    if (key in parentProvides) {
      return parentProvides[key]
    } else if (defaultValue) {
      if (typeof defaultValue === 'function') {
        return defaultValue()
      }
      return defaultValue
    }
  }
}
