import { camelize, toHandlerKey } from '../shared/index'

/*
 * @Author: simonyang
 * @Date: 2022-05-24 16:16:48
 * @LastEditTime: 2022-05-25 08:59:36
 * @LastEditors: simonyang
 * @Description:
 */
export function emit(instance, event, ...args) {
  console.log('emit', event)

  // 找到 props 中对应事件的响应函数
  const { props } = instance

  // add -> Add
  // add-foo -> addFoo

  const handlerName = toHandlerKey(camelize(event))
  const handler = props[handlerName]
  handler && handler(...args)
}
