/*
 * @Author: simonyang
 * @Date: 2022-04-19 15:57:14
 * @LastEditTime: 2022-04-19 21:15:20
 * @LastEditors: simonyang
 * @Description:
 */

import { isObject } from '../shared/index'
import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container) {
  patch(vnode, container)
}

// 递归处理 component / element
function patch(vnode, container) {
  if (typeof vnode.type === 'string') {
    // vnode.type 为 'div' 之类, 则为 element 类型的 vnode
    processElement(vnode, container)
  } else if (isObject(vnode.type)) {
    // vnode.type 为 对象, 则为组件类型的 vnode
    processComponent(vnode, container)
  }
}

function processElement(vnode: any, container: any) {
  // mount
  mountElement(vnode, container)
  // update
}

function mountElement(vnode: any, container: any) {
  const el = (vnode.el = document.createElement(vnode.type))

  // string | array
  const { children } = vnode
  // 挂载子节点
  if (typeof children === 'string') {
    el.textContent = children
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el)
  }

  // 挂载属性
  const { props } = vnode
  for (const key in props) {
    const val = props[key]
    el.setAttribute(key, val)
  }

  container.append(el)
}

function mountChildren(vnode, container) {
  vnode.children.forEach(v => {
    patch(v, container)
  })
}

function processComponent(vnode: any, container: any) {
  // mount
  mountComponent(vnode, container)

  // update
}

function mountComponent(initialVNode: any, container: any) {
  const instance = createComponentInstance(initialVNode)
  setupComponent(instance)
  setupRenderEffect(instance, initialVNode, container)
}

function setupRenderEffect(instance: any, initialVNode, container: any) {
  const { proxy } = instance
  // vnode
  const subTree = instance.render.call(proxy)

  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container)
  initialVNode.el = subTree.el
}
