/*
 * @Author: simonyang
 * @Date: 2022-04-18 19:48:51
 * @LastEditTime: 2022-04-19 11:06:33
 * @LastEditors: simonyang
 * @Description:
 */
function isObject(val) {
    return val !== null && typeof val === 'object';
}

/*
 * @Author: simonyang
 * @Date: 2022-04-19 21:04:20
 * @LastEditTime: 2022-04-19 21:11:01
 * @LastEditors: simonyang
 * @Description:
 */
const publicPropertiesMap = {
    $el: i => i.vnode.el,
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        // setupState
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
};

/*
 * @Author: simonyang
 * @Date: 2022-04-19 16:02:27
 * @LastEditTime: 2022-04-19 21:07:36
 * @LastEditors: simonyang
 * @Description:
 */
function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
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
    // ctx
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    const { setup } = Component;
    if (setup) {
        // function | object
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // TODO Function condition
    // object
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
 * @LastEditTime: 2022-04-19 21:15:20
 * @LastEditors: simonyang
 * @Description:
 */
function render(vnode, container) {
    patch(vnode, container);
}
// 递归处理 component / element
function patch(vnode, container) {
    if (typeof vnode.type === 'string') {
        // vnode.type 为 'div' 之类, 则为 element 类型的 vnode
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        // vnode.type 为 对象, 则为组件类型的 vnode
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    // mount
    mountElement(vnode, container);
    // update
}
function mountElement(vnode, container) {
    const el = (vnode.el = document.createElement(vnode.type));
    // string | array
    const { children } = vnode;
    // 挂载子节点
    if (typeof children === 'string') {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(vnode, el);
    }
    // 挂载属性
    const { props } = vnode;
    for (const key in props) {
        const val = props[key];
        el.setAttribute(key, val);
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(v => {
        patch(v, container);
    });
}
function processComponent(vnode, container) {
    // mount
    mountComponent(vnode, container);
    // update
}
function mountComponent(initialVNode, container) {
    const instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    const { proxy } = instance;
    // vnode
    const subTree = instance.render.call(proxy);
    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree, container);
    initialVNode.el = subTree.el;
}

/*
 * @Author: simonyang
 * @Date: 2022-04-19 15:54:28
 * @LastEditTime: 2022-04-19 18:23:14
 * @LastEditors: simonyang
 * @Description:
 */
function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        el: null,
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
            render(vnode, rootContainer);
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
