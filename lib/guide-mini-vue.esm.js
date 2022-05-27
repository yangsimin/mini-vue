const Fragment = Symbol('Fragment');
const Text = Symbol('Text');
function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        shapeFlag: getShapeFlag(type),
        el: null,
    };
    if (typeof children === 'string') {
        vnode.shapeFlag |= 4 /* TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ARRAY_CHILDREN */;
    }
    if (vnode.shapeFlag & 2 /* STATEFUL_COMPONENT */) {
        if (typeof children === 'object') {
            vnode.shapeFlag |= 16 /* SLOT_CHILDREN */;
        }
    }
    return vnode;
}
function createTextVNode(text) {
    return createVNode(Text, {}, text);
}
function getShapeFlag(type) {
    return typeof type === 'string'
        ? 1 /* ELEMENT */
        : 2 /* STATEFUL_COMPONENT */;
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

/*
 * @Author: simonyang
 * @Date: 2022-05-25 10:51:53
 * @LastEditTime: 2022-05-26 08:36:16
 * @LastEditors: simonyang
 * @Description:
 */
function renderSlots(slots, name, props) {
    const slot = slots[name];
    if (slot) {
        if (typeof slot === 'function') {
            return createVNode(Fragment, {}, slot(props));
        }
    }
}

/*
 * @Author: simonyang
 * @Date: 2022-04-18 19:48:51
 * @LastEditTime: 2022-05-25 08:59:26
 * @LastEditors: simonyang
 * @Description:
 */
const extend = Object.assign;
function isObject(val) {
    return val !== null && typeof val === 'object';
}
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
const camelize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : '';
    });
};
const capitalize = (str) => {
    return str[0].toUpperCase() + str.slice(1);
};
const toHandlerKey = (str) => {
    return str ? 'on' + capitalize(str) : '';
};

/*
 * @Author: simonyang
 * @Date: 2022-04-18 14:43:10
 * @LastEditTime: 2022-04-19 14:53:18
 * @LastEditors: simonyang
 * @Description:
 */
const targetMap = new WeakMap();
function trigger(target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap)
        return;
    let dep = depsMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}

/*
 * @Author: simonyang
 * @Date: 2022-04-18 20:13:32
 * @LastEditTime: 2022-04-19 14:22:17
 * @LastEditors: simonyang
 * @Description:
 */
// 缓存 get/set 函数
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, isShallow = false) {
    return function get(target, key) {
        // 用于判断 isReactive()
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* IS_READONLY */) {
            return isReadonly;
        }
        const res = Reflect.get(target, key);
        if (isShallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);
        trigger(target, key);
        return res;
    };
}
const mutableHandlers = {
    get,
    set,
};
const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`key:${key} set 失败 因为 target 是 readonly`, target);
        return true;
    },
};
const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet,
});

/*
 * @Author: simonyang
 * @Date: 2022-04-18 14:32:44
 * @LastEditTime: 2022-05-24 15:13:46
 * @LastEditors: simonyang
 * @Description:
 */
function reactive(raw) {
    return createActiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandlers);
}
function createActiveObject(target, baseHandlers) {
    if (!isObject(target)) {
        console.warn(`target ${target} must be an object`);
        return target;
    }
    return new Proxy(target, baseHandlers);
}

/*
 * @Author: simonyang
 * @Date: 2022-05-24 16:16:48
 * @LastEditTime: 2022-05-25 08:59:36
 * @LastEditors: simonyang
 * @Description:
 */
function emit(instance, event, ...args) {
    console.log('emit', event);
    // 找到 props 中对应事件的响应函数
    const { props } = instance;
    // add -> Add
    // add-foo -> addFoo
    const handlerName = toHandlerKey(camelize(event));
    const handler = props[handlerName];
    handler && handler(...args);
}

/*
 * @Author: simonyang
 * @Date: 2022-04-19 21:04:20
 * @LastEditTime: 2022-05-25 09:29:15
 * @LastEditors: simonyang
 * @Description:
 */
const publicPropertiesMap = {
    $el: i => i.vnode.el,
    $slots: i => i.slots,
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        // setupState
        const { setupState, props } = instance;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
};

/*
 * @Author: simonyang
 * @Date: 2022-05-24 14:57:11
 * @LastEditTime: 2022-05-24 15:20:22
 * @LastEditors: simonyang
 * @Description:
 */
function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

/*
 * @Author: simonyang
 * @Date: 2022-05-25 09:31:41
 * @LastEditTime: 2022-05-25 11:32:51
 * @LastEditors: simonyang
 * @Description:
 */
function initSlots(instance, children) {
    const { vnode } = instance;
    if (vnode.shapeFlag & 16 /* SLOT_CHILDREN */) {
        normalizeObjectSlots(children, instance.slots);
    }
}
function normalizeObjectSlots(children, slots) {
    for (const key in children) {
        const value = children[key];
        slots[key] = props => normalizeSlotValue(value(props));
    }
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

/*
 * @Author: simonyang
 * @Date: 2022-04-19 16:02:27
 * @LastEditTime: 2022-05-27 11:20:38
 * @LastEditors: simonyang
 * @Description:
 */
function createComponentInstance(vnode, parent) {
    console.log('createComponentInstance', parent);
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        render: {},
        proxy: {},
        props: {},
        emit: () => { },
        slots: {},
        provides: parent ? parent.provides : {},
        parent,
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    // ctx
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    const { setup } = Component;
    if (setup) {
        setCurrentInstance(instance);
        // function | object
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit,
        });
        setCurrentInstance(null);
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
let currentInstance = null;
function getCurrentInstance() {
    return currentInstance;
}
function setCurrentInstance(instance) {
    currentInstance = instance;
}

/*
 * @Author: simonyang
 * @Date: 2022-05-27 10:30:31
 * @LastEditTime: 2022-05-27 11:36:21
 * @LastEditors: simonyang
 * @Description:
 */
function provide(key, value) {
    // 存
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        let { provides } = currentInstance;
        const parentProvides = currentInstance.parent.provides;
        if (provides === parentProvides) {
            provides = currentInstance.provides = Object.create(provides);
        }
        provides[key] = value;
    }
}
function inject(key, defaultValue) {
    // 取
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        const parentProvides = currentInstance.parent.provides;
        if (key in parentProvides) {
            return parentProvides[key];
        }
        else if (defaultValue) {
            if (typeof defaultValue === 'function') {
                return defaultValue();
            }
            return defaultValue;
        }
    }
}

/*
 * @Author: simonyang
 * @Date: 2022-04-19 15:51:14
 * @LastEditTime: 2022-05-27 14:13:18
 * @LastEditors: simonyang
 * @Description:
 */
function createAppAPI(render) {
    return function createApp(rootComponent) {
        return {
            mount(rootContainer) {
                // 先将根节点转成 vnode
                const vnode = createVNode(rootComponent);
                render(vnode, rootContainer);
            },
        };
    };
}

/*
 * @Author: simonyang
 * @Date: 2022-04-19 15:57:14
 * @LastEditTime: 2022-05-27 14:54:36
 * @LastEditors: simonyang
 * @Description:
 */
function createRenderer(options) {
    const { createElement: hostCreateElement, patchProp: hostPatchProp, insert: hostInsert, } = options;
    function render(vnode, container) {
        patch(vnode, container, null);
    }
    // 递归处理 component / element
    function patch(vnode, container, parentComponent) {
        const { type, shapeFlag } = vnode;
        // Fragment -> 只渲染 children
        switch (type) {
            case Fragment:
                processFragment(vnode, container, parentComponent);
                break;
            case Text:
                processText(vnode, container);
                break;
            default:
                if (shapeFlag & 1 /* ELEMENT */) {
                    // vnode -> element -> mountElement
                    // vnode.type 为 'div' 之类, 则为 element 类型的 vnode
                    processElement(vnode, container, parentComponent);
                }
                else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
                    // vnode.type 为 对象, 则为组件类型的 vnode
                    processComponent(vnode, container, parentComponent);
                }
        }
    }
    function processFragment(vnode, container, parentComponent) {
        mountChildren(vnode, container, parentComponent);
    }
    function processText(vnode, container) {
        const { children } = vnode;
        const textNode = (vnode.el = document.createTextNode(children));
        container.append(textNode);
    }
    function processElement(vnode, container, parentComponent) {
        // mount
        mountElement(vnode, container, parentComponent);
        // update
    }
    function mountElement(vnode, container, parentComponent) {
        // const el = (vnode.el = document.createElement(vnode.type))
        const el = (vnode.el = hostCreateElement(vnode.type));
        // string | array
        const { children, shapeFlag } = vnode;
        // 挂载子节点
        if (shapeFlag & 4 /* TEXT_CHILDREN */) {
            el.textContent = children;
        }
        else if (shapeFlag & 8 /* ARRAY_CHILDREN */) {
            mountChildren(vnode, el, parentComponent);
        }
        // 挂载属性
        const { props } = vnode;
        for (const key in props) {
            const val = props[key];
            console.log(key);
            hostPatchProp(el, key, val);
        }
        // container.append(el)
        hostInsert(el, container);
    }
    function mountChildren(vnode, container, parentComponent) {
        vnode.children.forEach(v => {
            patch(v, container, parentComponent);
        });
    }
    // 处理组件
    function processComponent(vnode, container, parentComponent) {
        // mount
        mountComponent(vnode, container, parentComponent);
        // update
    }
    function mountComponent(initialVNode, container, parentComponent) {
        const instance = createComponentInstance(initialVNode, parentComponent);
        setupComponent(instance);
        setupRenderEffect(instance, initialVNode, container);
    }
    function setupRenderEffect(instance, initialVNode, container) {
        const { proxy } = instance;
        // vnode
        const subTree = instance.render.call(proxy);
        // vnode -> patch
        patch(subTree, container, instance);
        // 所有 el 都挂载完毕之后
        initialVNode.el = subTree.el;
    }
    return {
        createApp: createAppAPI(render),
    };
}

/*
 * @Author: simonyang
 * @Date: 2022-05-27 11:58:43
 * @LastEditTime: 2022-05-27 14:22:08
 * @LastEditors: simonyang
 * @Description:
 */
function createElement(type) {
    console.log('createElement---------------');
    return document.createElement(type);
}
function patchProp(el, key, val) {
    console.log('patchProp------------------');
    const isOn = (key) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, val);
    }
    else {
        el.setAttribute(key, val);
    }
}
function insert(el, parent) {
    console.log('insert-------------------');
    parent.append(el);
}
const render = createRenderer({
    createElement,
    patchProp,
    insert,
});
function createApp(...args) {
    return render.createApp(...args);
}

export { createApp, createRenderer, createTextVNode, getCurrentInstance, h, inject, provide, renderSlots };
