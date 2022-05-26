import { hasOwn } from '../shared/index'

/*
 * @Author: simonyang
 * @Date: 2022-04-19 21:04:20
 * @LastEditTime: 2022-05-25 09:29:15
 * @LastEditors: simonyang
 * @Description:
 */
const publicPropertiesMap = {
  $el: i => i.vnode.el,
  $slots: i => i.slots,
}
export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    // setupState
    const { setupState, props } = instance

    if (hasOwn(setupState, key)) {
      return setupState[key]
    } else if (hasOwn(props, key)) {
      return props[key]
    }

    const publicGetter = publicPropertiesMap[key]
    if (publicGetter) {
      return publicGetter(instance)
    }
  },
}
