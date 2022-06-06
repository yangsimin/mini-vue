import { generate } from './codegen'
import { baseParse } from './parse'
import { transform } from './transform'
import { transformElement } from './transforms/transformElement'
import { transformExpression } from './transforms/transformExpession'
import { transformText } from './transforms/transformText'

/*
 * @Author: simonyang
 * @Date: 2022-06-06 19:27:56
 * @LastEditTime: 2022-06-06 19:29:20
 * @LastEditors: simonyang
 * @Description:
 */
export function baseCompile(template) {
  const ast: any = baseParse(template)
  transform(ast, {
    nodeTransforms: [transformExpression, transformElement, transformText],
  })
  return generate(ast)
}
