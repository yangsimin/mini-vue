/*
 * @Author: simonyang
 * @Date: 2022-05-31 09:14:36
 * @LastEditTime: 2022-05-31 11:32:06
 * @LastEditors: simonyang
 * @Description:
 */
import { h, ref } from '../../lib/guide-mini-vue.esm.js'

import ArrayToText from './ArrayToText.js'
import TextToText from './TextToText.js'
import TextToArray from './TextToArray.js'
import ArrayToArray from './ArrayToArray.js'

const isChange = ref(false)
window.isChange = isChange

export const App = {
  name: 'App',
  setup() {},
  render() {
    return h('div', { tId: 1 }, [
      h('p', {}, '主页'),
      // h('p', {}, [h('p', {}, 'ArrayToText: '), h(ArrayToText)]),
      // h('hr'),
      // h('p', {}, [h('p', {}, 'TextToText: '), h(TextToText)]),
      // h('hr'),
      // h('p', {}, [h('p', {}, 'TextToArray: '), h(TextToArray)]),
      // h('hr'),
      h('p', {}, [h('p', {}, 'ArrayToArray: '), h(ArrayToArray)]),
    ])
  },
}
