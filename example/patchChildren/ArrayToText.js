/*
 * @Author: simonyang
 * @Date: 2022-05-31 09:15:56
 * @LastEditTime: 2022-05-31 10:15:16
 * @LastEditors: simonyang
 * @Description:
 */
import { ref, h } from '../../lib/guide-mini-vue.esm.js'
const nextChildren = 'newChildren'
const prevChildren = [h('div', {}, 'A'), h('div', {}, 'B')]

export default {
  name: 'ArrayToText',
  setup() {
    const isChange = window.isChange

    return { isChange }
  },
  render() {
    const self = this
    return self.isChange === true
      ? h('div', {}, nextChildren)
      : h('div', {}, prevChildren)
  },
}
