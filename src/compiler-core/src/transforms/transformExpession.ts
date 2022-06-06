import { NodeTypes } from '../ast'

/*
 * @Author: simonyang
 * @Date: 2022-06-06 11:57:18
 * @LastEditTime: 2022-06-06 14:22:02
 * @LastEditors: simonyang
 * @Description:
 */
export function transformExpression(node) {
  if (node.type === NodeTypes.INTERPOLATION) {
    node.content = processExpression(node.content)
  }
}

function processExpression(node: any) {
  node.content = `_ctx.${node.content}`
  return node
}
