import { generate } from '../src/codegen'
import { baseParse } from '../src/parse'
import { transform } from '../src/transform'
import { transformElement } from '../src/transforms/transformElement'
import { transformExpression } from '../src/transforms/transformExpession'
import { transformText } from '../src/transforms/transformText'

/*
 * @Author: simonyang
 * @Date: 2022-06-03 16:09:45
 * @LastEditTime: 2022-06-06 17:50:35
 * @LastEditors: simonyang
 * @Description:
 */
describe('codegen', () => {
  it('string', () => {
    const ast = baseParse('hi')
    transform(ast)
    const { code } = generate(ast)

    // 快照
    expect(code).toMatchSnapshot()
  })

  it('interpolation', () => {
    const ast = baseParse('{{message}}')
    transform(ast, {
      nodeTransforms: [transformExpression],
    })
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })

  it('element', () => {
    const ast: any = baseParse('<div>hi,{{message}}</div>')
    transform(ast, {
      nodeTransforms: [transformExpression, transformElement, transformText],
    })
    console.log(ast.codegenNode.children)
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })
})
