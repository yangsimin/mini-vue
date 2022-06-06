/*
 * @Author: simonyang
 * @Date: 2022-06-06 18:35:37
 * @LastEditTime: 2022-06-06 18:36:05
 * @LastEditors: simonyang
 * @Description:
 */

import { NodeTypes } from "./ast";

export function isText(node) {
  return node.type === NodeTypes.TEXT || node.type === NodeTypes.INTERPOLATION
}
