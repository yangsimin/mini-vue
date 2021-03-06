import { proxyRefs } from '../reactivity/index'
import { shallowReadonly } from '../reactivity/reactive'
import { emit } from './componentEmit'
import { PublicInstanceProxyHandlers } from './componentPlublicInstance'
import { initProps } from './componentProps'
import { initSlots } from './componentSlots'

/*
 * @Author: simonyang
 * @Date: 2022-04-19 16:02:27
 * @LastEditTime: 2022-06-06 19:44:12
 * @LastEditors: simonyang
 * @Description:
 */
export function createComponentInstance(vnode, parent) {
  const component = {
    vnode,
    type: vnode.type,
    next: null,
    setupState: {},
    render: {},
    proxy: {},
    props: {},
    emit: () => {},
    slots: {},
    provides: parent ? parent.provides : {},
    parent,
    isMounted: false,
    subTree: {},
  }
  component.emit = emit.bind(null, component) as any
  return component
}

export function setupComponent(instance) {
  initProps(instance, instance.vnode.props)
  initSlots(instance, instance.vnode.children)
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type

  // ctx
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)

  const { setup } = Component

  if (setup) {
    setCurrentInstance(instance)
    // function | object
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    })

    setCurrentInstance(null)
    handleSetupResult(instance, setupResult)
  }
}
function handleSetupResult(instance, setupResult: Object | Function) {
  // TODO Function condition

  // object
  if (typeof setupResult === 'object') {
    instance.setupState = proxyRefs(setupResult)
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
  const Component = instance.type
  if (compiler && !Component.render) {
    if (Component.template) {
      Component.render = compiler(Component.template)
    }
  }
  instance.render = Component.render
}

let currentInstance = null

export function getCurrentInstance() {
  return currentInstance
}

export function setCurrentInstance(instance) {
  currentInstance = instance
}

let compiler
export function registerRuntimeCompiler(_compiler) {
  compiler = _compiler
}
