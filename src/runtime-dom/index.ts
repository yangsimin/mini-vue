/*
 * @Author: simonyang
 * @Date: 2022-05-27 11:58:43
 * @LastEditTime: 2022-05-27 14:22:08
 * @LastEditors: simonyang
 * @Description:
 */
import { createRenderer } from '../runtime-core/index'

function createElement(type) {
  console.log('createElement---------------')
  return document.createElement(type)
}
function patchProp(el, key, val) {
  console.log('patchProp------------------')
  const isOn = (key: string) => /^on[A-Z]/.test(key)
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase()
    el.addEventListener(event, val)
  } else {
    el.setAttribute(key, val)
  }
}
function insert(el, parent) {
  console.log('insert-------------------')
  parent.append(el)
}

const render: any = createRenderer({
  createElement,
  patchProp,
  insert,
})

export function createApp(...args) {
  return render.createApp(...args)
}

export * from '../runtime-core'
