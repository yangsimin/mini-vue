/*
 * @Author: simonyang
 * @Date: 2022-05-31 18:42:50
 * @LastEditTime: 2022-05-31 18:46:24
 * @LastEditors: simonyang
 * @Description:
 */
export function shouldUpdateComponent(prevVNode, nextVNode) {
  const { props: prevProps } = prevVNode
  const { props: nextProps } = nextVNode

  for (const key in nextProps) {
    if (nextProps[key] !== prevProps[key]) {
      return true
    }
  }

  return false
}
