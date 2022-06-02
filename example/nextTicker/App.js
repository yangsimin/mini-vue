/*
 * @Author: simonyang
 * @Date: 2022-05-31 18:56:34
 * @LastEditTime: 2022-06-02 10:31:29
 * @LastEditors: simonyang
 * @Description:
 */
import {
  h,
  ref,
  getCurrentInstance,
  nextTick,
} from '../../lib/guide-mini-vue.esm.js'

export const App = {
  name: 'App',
  setup() {
    const count = ref(1)
    const instance = getCurrentInstance()

    function onClick() {
      for (let i = 0; i < 100; i++) {
        console.log('update', i)
        count.value = i
      }

      console.log(instance)
      nextTick(() => {
        console.log(instance)
      })
    }
    return {
      count,
      onClick,
    }
  },
  render() {
    const button = h('button', { onClick: this.onClick }, 'update')
    const p = h('p', {}, 'count:' + this.count)

    return h('div', {}, [button, p])
  },
}
