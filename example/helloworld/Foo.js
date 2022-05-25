/*
 * @Author: simonyang
 * @Date: 2022-05-24 14:48:52
 * @LastEditTime: 2022-05-24 18:38:36
 * @LastEditors: simonyang
 * @Description:
 */
import { h } from '../../lib/guide-mini-vue.esm.js'

export const Foo = {
  setup(props, { emit }) {
    // props.count
    console.log(props)
    const emitAdd = () => {
      console.log('emit add')
      emit('add', 1, 2)
      emit('add-foo', 2, 3)
    }
    return {
      emitAdd,
    }
  },
  render() {
    const btn = h(
      'button',
      {
        onClick: this.emitAdd,
      },
      'emitAdd'
    )
    const foo = h('p', {}, 'foo')
    return h('div', {}, [foo, btn])
  },
}
