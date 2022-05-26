/*
 * @Author: simonyang
 * @Date: 2022-04-19 15:16:46
 * @LastEditTime: 2022-05-26 08:58:25
 * @LastEditors: simonyang
 * @Description:
 */
import { h, createTextVNode } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'

window.self = null
export const App = {
  name: 'App',
  render() {
    const app = h('div', {}, 'App')
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => [
          h('header', {}, 'header' + age),
          createTextVNode('你好呀'),
        ],
        footer: () => h('footer', {}, 'footer'),
      }
    )
    return h('div', {}, [app, foo])
  },
  setup() {
    return {}
  },
}
