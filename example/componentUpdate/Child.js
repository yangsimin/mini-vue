/*
 * @Author: simonyang
 * @Date: 2022-05-31 17:39:08
 * @LastEditTime: 2022-05-31 17:48:43
 * @LastEditors: simonyang
 * @Description:
 */
import { h } from '../../lib/guide-mini-vue.esm.js'
export default {
  name: 'Child',
  setup(props, { emit }) {},
  render(proxy) {
    return h('div', {}, [
      h('div', {}, 'child - props - msg: ' + this.$props.msg),
    ])
  },
}
