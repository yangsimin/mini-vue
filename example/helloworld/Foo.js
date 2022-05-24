/*
 * @Author: simonyang
 * @Date: 2022-05-24 14:48:52
 * @LastEditTime: 2022-05-24 15:20:53
 * @LastEditors: simonyang
 * @Description:
 */
import { h } from '../../lib/guide-mini-vue.esm.js'

export const Foo = {
  setup(props) {
    // props.count
    console.log(props)
    props.count++
    console.log(props)
  },
  render() {
    return h('div', {}, 'foo: ' + this.count)
  },
}
