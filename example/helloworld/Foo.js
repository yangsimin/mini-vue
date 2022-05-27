/*
 * @Author: simonyang
 * @Date: 2022-05-24 14:48:52
 * @LastEditTime: 2022-05-27 10:03:21
 * @LastEditors: simonyang
 * @Description:
 */
import {
  h,
  renderSlots,
  getCurrentInstance,
} from '../../lib/guide-mini-vue.esm.js'

export const Foo = {
  name: 'Foo',
  setup() {
    const instance = getCurrentInstance()
    console.log('Foo:', instance)
  },
  render() {
    const foo = h('p', {}, 'foo')
    const age = 10
    return h('div', {}, foo)
  },
}
