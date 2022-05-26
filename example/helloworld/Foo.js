/*
 * @Author: simonyang
 * @Date: 2022-05-24 14:48:52
 * @LastEditTime: 2022-05-25 11:24:21
 * @LastEditors: simonyang
 * @Description:
 */
import { h, renderSlots } from '../../lib/guide-mini-vue.esm.js'

export const Foo = {
  setup() {
    return {}
  },
  render() {
    const foo = h('p', {}, 'foo')
    console.log(this.$slots)
    const age = 10
    return h('div', {}, [
      renderSlots(this.$slots, 'header', { age }),
      foo,
      renderSlots(this.$slots, 'footer'),
    ])
  },
}
