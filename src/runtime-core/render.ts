/*
 * @Author: simonyang
 * @Date: 2022-04-19 15:57:14
 * @LastEditTime: 2022-05-25 10:54:05
 * @LastEditors: simonyang
 * @Description:
 */

import { isObject } from '../shared/index'
import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container) {
  patch(vnode, container)
}

// 递归处理 component / element
function patch(vnode, container) {
  const { shapeFlag } = vnode
  if (shapeFlag & ShapeFlags.ELEMENT) {
    // vnode -> element -> mountElement
    // vnode.type 为 'div' 之类, 则为 element 类型的 vnode
    processElement(vnode, container)
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
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
  const { children, shapeFlag } = vnode
  // 挂载子节点
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el)
  }

  // 挂载属性
  const { props } = vnode
  for (const key in props) {
    const val = props[key]
    console.log(key)
    const isOn = (key: string) => /^on[A-Z]/.test(key)
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase()
      el.addEventListener(event, val)
    } else {
      el.setAttribute(key, val)
    }
  }

  container.append(el)
}

function mountChildren(vnode, container) {
  vnode.children.forEach(v => {
    patch(v, container)
  })
}

// 处理组件
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
  patch(subTree, container)
  // 所有 el 都挂载完毕之后
  initialVNode.el = subTree.el
}
