/*
 * @Author: simonyang
 * @Date: 2022-04-19 15:57:14
 * @LastEditTime: 2022-05-27 10:50:53
 * @LastEditors: simonyang
 * @Description:
 */

import { isObject } from '../shared/index'
import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text } from './vnode'

export function render(vnode, container) {
  patch(vnode, container)
}

// 递归处理 component / element
function patch(vnode, container, parentComponent) {
  const { type, shapeFlag } = vnode

  // Fragment -> 只渲染 children
  switch (type) {
    case Fragment:
      processFragment(vnode, container, parentComponent)
      break
    case Text:
      processText(vnode, container)
      break
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        // vnode -> element -> mountElement
        // vnode.type 为 'div' 之类, 则为 element 类型的 vnode
        processElement(vnode, container, parentComponent)
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        // vnode.type 为 对象, 则为组件类型的 vnode
        processComponent(vnode, container, parentComponent)
      }
  }
}

function processFragment(vnode: any, container: any, parentComponent) {
  mountChildren(vnode, container, parentComponent)
}

function processText(vnode: any, container: any) {
  const { children } = vnode
  const textNode = (vnode.el = document.createTextNode(children))
  container.append(textNode)
}

function processElement(vnode: any, container: any, parentComponent) {
  // mount
  mountElement(vnode, container, parentComponent)
  // update
}

function mountElement(vnode: any, container: any, parentComponent) {
  const el = (vnode.el = document.createElement(vnode.type))

  // string | array
  const { children, shapeFlag } = vnode
  // 挂载子节点
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el, parentComponent)
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

function mountChildren(vnode, container, parentComponent) {
  vnode.children.forEach(v => {
    patch(v, container, parentComponent)
  })
}

// 处理组件
function processComponent(vnode: any, container: any, parentComponent) {
  // mount
  mountComponent(vnode, container, parentComponent)

  // update
}

function mountComponent(initialVNode: any, container: any, parentComponent) {
  const instance = createComponentInstance(initialVNode, parentComponent)
  setupComponent(instance)
  setupRenderEffect(instance, initialVNode, container)
}

function setupRenderEffect(instance: any, initialVNode, container: any) {
  const { proxy } = instance
  // vnode
  const subTree = instance.render.call(proxy)

  // vnode -> patch
  patch(subTree, container, instance)
  // 所有 el 都挂载完毕之后
  initialVNode.el = subTree.el
}
