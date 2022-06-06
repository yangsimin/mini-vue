import { CREATE_ELEMENT_VNODE } from "./runtimeHelpers"

/*
 * @Author: simonyang
 * @Date: 2022-06-02 13:03:48
 * @LastEditTime: 2022-06-06 18:34:48
 * @LastEditors: simonyang
 * @Description:
 */
export const enum NodeTypes {
  INTERPOLATION,
  SIMPLE_EXPRESSION,
  ELEMENT,
  TEXT,
  ROOT,
  COMPOUND_EXPRESSION,
}

export function createVNodeCall(context, tag, props, children) {
  context.helper(CREATE_ELEMENT_VNODE)
  return {
    type: NodeTypes.ELEMENT,
    tag,
    props,
    children,
  }
}
