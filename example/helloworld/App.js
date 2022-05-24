/*
 * @Author: simonyang
 * @Date: 2022-04-19 15:16:46
 * @LastEditTime: 2022-05-24 14:53:31
 * @LastEditors: simonyang
 * @Description:
 */
import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'

window.self = null
export const App = {
  render() {
    window.self = this
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'hard'],
        onClick() {
          console.log('click')
        },
      },
      [
        h('div', {}, 'hi,' + this.msg),
        h(Foo, {
          count: 1,
        }),
      ]
      // 'hi, ' + this.msg
      // [h('p', { class: 'red' }, 'hi'), h('p', { class: 'blue' }, this.msg)]
    )
  },
  setup() {
    return {
      msg: 'mini-vue-again',
    }
  },
}
