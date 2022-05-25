import { shallowReadonly } from '../reactivity/reactive'
import { emit } from './componentEmit'
import { PublicInstanceProxyHandlers } from './componentPlublicInstance'
import { initProps } from './componentProps'

/*
 * @Author: simonyang
 * @Date: 2022-04-19 16:02:27
 * @LastEditTime: 2022-05-24 16:29:10
 * @LastEditors: simonyang
 * @Description:
 */
export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    render: {},
    proxy: {},
    props: {},
    emit: () => {},
  }
  component.emit = emit.bind(null, component) as any
  return component
}

export function setupComponent(instance) {
  // TODO initProps()
  initProps(instance, instance.vnode.props)
  // TODO initSlots()
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type

  // ctx
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)

  const { setup } = Component

  if (setup) {
    // function | object
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    })

    handleSetupResult(instance, setupResult)
  }
}
function handleSetupResult(instance, setupResult: Object | Function) {
  // TODO Function condition

  // object
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
  const Component = instance.type
  if (Component.render) {
    instance.render = Component.render
  }
}
