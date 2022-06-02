/*
 * @Author: simonyang
 * @Date: 2022-04-19 15:57:14
 * @LastEditTime: 2022-06-02 09:53:44
 * @LastEditors: simonyang
 * @Description:
 * 性能优化点:
 * 1. 分别对左右两端进行对比, 取中间不同的部分进行对比, 缩小比对范围
 * 2. 使用了<最大递增子序列算法>, 找出相对位置稳定不变的子序列, 尽可能减少节点的移动
 * 3. 使用节点的 key 创建新老节点映射表, 缩小查找的时间复杂度
 */

import { effect } from '../reactivity/effect'
import { EMPTY_OBJ } from '../shared'
import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { shouldUpdateComponent } from './componentUpdateUtils'
import { createAppAPI } from './createApp'
import { queueJobs } from './scheduler'
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
    patch(null, vnode, container, null, null)
  }

  // 递归处理 component / element
  function patch(n1, n2, container, parentComponent, anchor) {
    const { type, shapeFlag } = n2
    // Fragment -> 只渲染 children
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor)
        break
      case Text:
        processText(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // vnode -> element -> mountElement
          // vnode.type 为 'div' 之类, 则为 element 类型的 vnode
          processElement(n1, n2, container, parentComponent, anchor)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // vnode.type 为 对象, 则为组件类型的 vnode
          processComponent(n1, n2, container, parentComponent, anchor)
        }
    }
  }

  function processFragment(
    n1,
    n2: any,
    container: any,
    parentComponent,
    anchor
  ) {
    mountChildren(n2.children, container, parentComponent, anchor)
  }

  function processText(n1, n2: any, container: any) {
    const { children } = n2
    const textNode = (n2.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processElement(
    n1,
    n2: any,
    container: any,
    parentComponent,
    anchor
  ) {
    if (!n1) {
      // mount
      mountElement(n2, container, parentComponent, anchor)
    } else {
      // update
      patchElement(n1, n2, container, parentComponent, anchor)
    }
  }

  function patchElement(n1, n2, container, parentComponent, anchor) {
    console.log('patchElement')
    console.log('n1', n1)
    console.log('n2', n2)

    // props
    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ

    const el = (n2.el = n1.el)
    patchProps(el, oldProps, newProps)
    // children
    patchChildren(n1, n2, parentComponent, anchor)
  }

  function patchChildren(n1, n2, parentComponent, anchor) {
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
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, '')
        mountChildren(c2, container, parentComponent, anchor)
      } else {
        // array diff array
        patchKeyedChildren(c1, c2, container, parentComponent, anchor)
      }
    }
  }
  function patchKeyedChildren(
    c1,
    c2,
    container,
    parentComponent,
    parentAnchor
  ) {
    let i = 0
    let e1 = c1.length - 1
    let e2 = c2.length - 1

    function isSameVNodeType(n1, n2) {
      return n1.type === n2.type && n1.key === n2.key
    }
    // 左侧对比
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]

      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break
      }
      i++
    }
    console.log(i)

    // 对比右侧
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]

      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break
      }
      e1--
      e2--
    }

    // 3. 新的比老的多, 需要创建
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1
        const anchor = nextPos < c2.length ? c2[nextPos].el : null
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor)
          i++
        }
      }
    } else if (i > e2) {
      // 4. 老的比新的多, 需要删除
      while (i <= e1) {
        hostRemove(c1[i].el)
        i++
      }
    } else {
      // 处理中间乱序的三种情况, 创建新的/删除老的/移动

      let s1 = i
      let s2 = i
      const toBePatched = e2 - s2 + 1
      let patched = 0
      const keyToNewIndexMap = new Map()
      const newIndexToOldIndexMap = new Array(toBePatched)
      let moved = false
      let maxNewIndexSoFar = 0

      // 初始化映射表, 对应的中间需要对比的节点的老索引
      for (let i = 0; i < toBePatched; i++) {
        newIndexToOldIndexMap[i] = 0
      }

      // 初始化映射表, 存放新节点对应的 key
      for (let i = s2; i <= e2; i++) {
        const nextChild = c2[i]
        keyToNewIndexMap.set(nextChild.key, i)
      }

      // 1.1 若找到与新节点对应的旧节点, 则调用 patch 挂载节点
      // 1.2 删除无映射的旧节点
      for (let i = s1; i <= e1; i++) {
        const prevChild = c1[i]

        // 如果所有新节点已 patch, 剩余的老节点都为冗余节点, 可直接删除
        if (patched >= toBePatched) {
          hostRemove(prevChild.el)
          continue
        }

        let newIndex
        if (prevChild.key !== null) {
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          for (let j = s2; j <= e2; j++) {
            if (isSameVNodeType(prevChild, c2[j])) {
              newIndex = j
              break
            }
          }
        }

        if (newIndex === undefined) {
          hostRemove(prevChild.el)
        } else {
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex
          } else {
            moved = true
          }
          // [new] = old + 1
          newIndexToOldIndexMap[newIndex - s2] = i + 1
          patch(prevChild, c2[newIndex], container, parentComponent, null)
          patched++
        }
      }

      // 2.1 找到新节点中对应老节点的索引
      // 2.2 找到最长的递增子序列, 只移动非子序列中的节点, 减少移动次数
      // 2.3 由于使用 insertBefore      插入, 需要确保右边锚点元素位置确定, 所以从右遍历移动
      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndexMap)
        : []
      let j = increasingNewIndexSequence.length - 1

      for (let i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = i + s2
        const nextChild = c2[nextIndex]
        const anchor = nextIndex + 1 < c2.length ? c2[nextIndex + 1].el : null

        // 需要创建节点
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, parentComponent, anchor)
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            console.log('移动位置')
            hostInsert(nextChild.el, container, anchor)
          } else {
            j--
          }
        }
      }
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

  function mountElement(vnode: any, container: any, parentComponent, anchor) {
    // const el = (vnode.el = document.createElement(vnode.type))
    const el = (vnode.el = hostCreateElement(vnode.type))

    // string | array
    const { children, shapeFlag } = vnode
    // 挂载子节点
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el, parentComponent, anchor)
    }

    // 挂载属性
    const { props } = vnode
    for (const key in props) {
      const val = props[key]
      hostPatchProp(el, key, null, val)
    }
    // container.append(el)
    hostInsert(el, container, anchor)
  }

  function mountChildren(children, container, parentComponent, anchor) {
    children.forEach(v => {
      patch(null, v, container, parentComponent, anchor)
    })
  }

  // 处理组件
  function processComponent(
    n1,
    n2: any,
    container: any,
    parentComponent,
    anchor
  ) {
    if (!n1) {
      // mount
      mountComponent(n2, container, parentComponent, anchor)
    } else {
      // update
      updateComponent(n1, n2)
    }
  }

  function updateComponent(n1, n2) {
    const instance = (n2.component = n1.component)
    if (shouldUpdateComponent(n1, n2)) {
      instance.next = n2
      instance.update()
    } else {
      n2.el = n1.el
      instance.vnode = n2
    }
  }

  function mountComponent(
    initialVNode: any,
    container: any,
    parentComponent,
    anchor
  ) {
    const instance = (initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent
    ))
    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container, anchor)
  }

  function setupRenderEffect(
    instance: any,
    initialVNode,
    container: any,
    anchor
  ) {
    instance.update = effect(
      () => {
        if (!instance.isMounted) {
          const { proxy } = instance
          // vnode
          const subTree = (instance.subTree = instance.render.call(proxy))
          console.log('init')
          // vnode -> patch
          patch(null, subTree, container, instance, anchor)
          // 所有 el 都挂载完毕之后
          initialVNode.el = subTree.el

          instance.isMounted = true
        } else {
          console.log('update')

          const { next, vnode } = instance
          if (next) {
            next.el = vnode.el
            updateComponentPreRender(instance, next)
          }
          const { proxy } = instance
          const subTree = instance.render.call(proxy)
          const prevSubTree = instance.subTree
          instance.subTree = subTree
          console.log('current', subTree)
          console.log('prev', prevSubTree)
          patch(prevSubTree, subTree, container, instance, anchor)
        }
      },
      {
        scheduler() {
          console.log('update - scheduler')
          // instance.update()
          queueJobs(instance.update)
        },
      }
    )
  }

  return {
    createApp: createAppAPI(render),
  }
}

function updateComponentPreRender(instance, nextVNode) {
  instance.vnode = nextVNode
  instance.next = null
  instance.props = nextVNode.props
}

function getSequence(arr) {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = (u + v) >> 1
        if (arr[result[c]] < arrI) {
          u = c + 1
        } else {
          v = c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]
        }
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}
