/*
 * @Author: simonyang
 * @Date: 2022-04-19 15:16:46
 * @LastEditTime: 2022-04-19 18:26:06
 * @LastEditors: simonyang
 * @Description:
 */
import { h } from '../../lib/guide-mini-vue.esm.js'

window.self = null
export const App = {
  render() {
    window.self = this
    return h(
      'div',
      { id: 'root', class: ['red', 'hard'] },
      'hi, ' + this.msg
      // [h('p', { class: 'red' }, 'hi'), h('p', { class: 'blue' }, 'hi again')]
    )
  },
  setup() {
    return {
      msg: 'mini-vue-again',
    }
  },
}
