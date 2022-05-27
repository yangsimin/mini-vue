import { h } from '../../lib/guide-mini-vue.esm.js'

/*
 * @Author: simonyang
 * @Date: 2022-05-27 14:36:25
 * @LastEditTime: 2022-05-27 14:39:53
 * @LastEditors: simonyang
 * @Description:
 */
export const App = {
  setup() {
    return {
      x: 100,
      y: 100,
    }
  },
  render() {
    return h('rect', { x: this.x, y: this.y })
  },
}
