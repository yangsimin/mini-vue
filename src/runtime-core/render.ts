/*
 * @Author: simonyang
 * @Date: 2022-04-19 15:57:14
 * @LastEditTime: 2022-05-31 10:34:50
 * @LastEditors: simonyang
 * @Description:
 */

import { effect } from '../reactivity/effect'
import { EMPTY_OBJ } from '../shared'
import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { createAppAPI } from './createApp'
import { Fragment, Text } from './vnode'

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options

  function render(vnode, container) {
    patch(null, vnode, container, null)
  }

  // 递归处理 component / element
  function patch(n1, n2, container, parentComponent) {
    const { type, shapeFlag } = n2
    // Fragment -> 只渲染 children
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break
      case Text:
        processText(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // vnode -> element -> mountElement
          // vnode.type 为 'div' 之类, 则为 element 类型的 vnode
          processElement(n1, n2, container, parentComponent)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // vnode.type 为 对象, 则为组件类型的 vnode
          processComponent(n1, n2, container, parentComponent)
        }
    }
  }

  function processFragment(n1, n2: any, container: any, parentComponent) {
    mountChildren(n2.children, container, parentComponent)
  }

  function processText(n1, n2: any, container: any) {
    const { children } = n2
    const textNode = (n2.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processElement(n1, n2: any, container: any, parentComponent) {
    if (!n1) {
      // mount
      mountElement(n2, container, parentComponent)
    } else {
      // update
      patchElement(n1, n2, container, parentComponent)
    }
  }

  function patchElement(n1, n2, container, parentComponent) {
    console.log('patchElement')
    console.log('n1', n1)
    console.log('n2', n2)

    // props
    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ

    const el = (n2.el = n1.el)
    patchProps(el, oldProps, newProps)
    // children
    patchChildren(n1, n2, parentComponent)
  }

  function patchChildren(n1, n2, parentComponent) {
    const prevShapeFlag = n1.shapeFlag
    const { shapeFlag } = n2
    const container = n2.el
    const c1 = n1.children
    const c2 = n2.children

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 1. 将老的 Children 清空
        unmountChildren(n1.children)
      }
      if (c1 !== c2) {
        // 2. 设置 text
        hostSetElementText(container, c2)
      }
    } else {
      hostSetElementText(container, '')
      mountChildren(c2, container, parentComponent)
    }
  }

  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el
      hostRemove(el)
    }
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key]
        const nextProp = newProps[key]

        if (prevProp !== nextProp) {
          hostPatchProp(el, key, prevProp, nextProp)
        }
      }

      if (oldProps !== EMPTY_OBJ) {
        // 老节点上的prop, 新节点已经没有了, 删除prop
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null)
          }
        }
      }
    }
  }

  function mountElement(vnode: any, container: any, parentComponent) {
    // const el = (vnode.el = document.createElement(vnode.type))
    const el = (vnode.el = hostCreateElement(vnode.type))

    // string | array
    const { children, shapeFlag } = vnode
    // 挂载子节点
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el, parentComponent)
    }

    // 挂载属性
    const { props } = vnode
    for (const key in props) {
      const val = props[key]
      hostPatchProp(el, key, null, val)
    }
    // container.append(el)
    hostInsert(el, container)
  }

  function mountChildren(children, container, parentComponent) {
    children.forEach(v => {
      patch(null, v, container, parentComponent)
    })
  }

  // 处理组件
  function processComponent(n1, n2: any, container: any, parentComponent) {
    // mount
    mountComponent(n2, container, parentComponent)

    // update
  }

  function mountComponent(initialVNode: any, container: any, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container)
  }

  function setupRenderEffect(instance: any, initialVNode, container: any) {
    effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance
        // vnode
        const subTree = (instance.subTree = instance.render.call(proxy))
        console.log('init')
        // vnode -> patch
        patch(null, subTree, container, instance)
        // 所有 el 都挂载完毕之后
        initialVNode.el = subTree.el

        instance.isMounted = true
      } else {
        console.log('update')

        const { proxy } = instance
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree
        instance.subTree = subTree
        console.log('current', subTree)
        console.log('prev', prevSubTree)
        patch(prevSubTree, subTree, container, instance)
      }
    })
  }

  return {
    createApp: createAppAPI(render),
  }
}
