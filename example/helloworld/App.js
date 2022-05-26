/*
 * @Author: simonyang
 * @Date: 2022-04-19 15:16:46
 * @LastEditTime: 2022-05-25 11:19:56
 * @LastEditors: simonyang
 * @Description:
 */
import { h } from '../../lib/guide-mini-vue.esm.js'
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
        header: ({ age }) => h('header', {}, 'header' + age),
        footer: () => h('footer', {}, 'footer'),
      }
    )
    return h('div', {}, [app, foo])
  },
  setup() {
    return {}
  },
}
