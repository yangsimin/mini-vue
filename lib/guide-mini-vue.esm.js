/*
 * @Author: simonyang
 * @Date: 2022-04-19 16:02:27
 * @LastEditTime: 2022-04-19 16:18:46
 * @LastEditors: simonyang
 * @Description:
 */
function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
    };
    return component;
}
function setupComponent(instance) {
    // TODO initProps()
    // TODO initSlots()
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    const { setup } = Component;
    if (setup) {
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // TODO Function condition
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}

/*
 * @Author: simonyang
 * @Date: 2022-04-19 15:57:14
 * @LastEditTime: 2022-04-19 16:34:09
 * @LastEditors: simonyang
 * @Description:
 */
function render(vnode, container) {
    patch(vnode);
}
function patch(vnode, container) {
    // 处理 component / element
    processComponent(vnode);
}
function processComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree);
}

/*
 * @Author: simonyang
 * @Date: 2022-04-19 15:54:28
 * @LastEditTime: 2022-04-19 15:54:29
 * @LastEditors: simonyang
 * @Description:
 */
function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
    };
    return vnode;
}

/*
 * @Author: simonyang
 * @Date: 2022-04-19 15:51:14
 * @LastEditTime: 2022-04-19 15:57:05
 * @LastEditors: simonyang
 * @Description:
 */
function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            const vnode = createVNode(rootComponent);
            render(vnode);
        },
    };
}

/*
 * @Author: simonyang
 * @Date: 2022-04-19 16:57:40
 * @LastEditTime: 2022-04-19 16:57:41
 * @LastEditors: simonyang
 * @Description:
 */
function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
