/*
 * @Author: simonyang
 * @Date: 2022-04-19 15:16:46
 * @LastEditTime: 2022-04-19 15:17:52
 * @LastEditors: simonyang
 * @Description:
 */
import { h } from '../../lib/guide-mini-vue.esm.js'

export const App = {
  render() {
    return h('div', 'hi, ' + this.msg)
  },
  setup() {
    return {
      msg: 'mini-vue',
    }
  },
}
