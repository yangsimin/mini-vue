/*
 * @Author: simonyang
 * @Date: 2022-04-19 16:02:27
 * @LastEditTime: 2022-04-19 16:18:46
 * @LastEditors: simonyang
 * @Description:
 */
export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
  }
  return component
}

export function setupComponent(instance) {
  // TODO initProps()
  // TODO initSlots()
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type
  const { setup } = Component

  if (setup) {
    const setupResult: Function | Object = setup()

    handleSetupResult(instance, setupResult)
  }
}
function handleSetupResult(instance, setupResult: Object | Function) {
  // TODO Function condition

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
