/*
 * @Author: simonyang
 * @Date: 2022-04-19 21:45:06
 * @LastEditTime: 2022-04-19 21:46:11
 * @LastEditors: simonyang
 * @Description:
 */

export const enum ShapeFlags {
  ELEMENT = 1, // 0001
  STATEFUL_COMPONENT = 1 << 1, // 0010
  TEXT_CHILDREN = 1 << 2, // 0100
  ARRAY_CHILDREN = 1 << 3, // 1000
}
