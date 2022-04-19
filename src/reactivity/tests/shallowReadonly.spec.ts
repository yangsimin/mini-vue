/*
 * @Author: simonyang
 * @Date: 2022-04-19 09:47:12
 * @LastEditTime: 2022-04-19 09:57:21
 * @LastEditors: simonyang
 * @Description:
 */
import { isReadonly, shallowReadonly } from '../reactive'

describe('shallowReadonly', () => {
  it('should not make non-reactive properties reactive', () => {
    const props = shallowReadonly({ n: { foo: 1 } })
    expect(isReadonly(props)).toBe(true)
    expect(isReadonly(props.n)).toBe(false)
  })
  it('warn then call set', () => {
    const user = shallowReadonly({
      age: 10,
    })
    const warn = console.warn
    console.warn = jest.fn()
    user.age = 11
    expect(console.warn).toBeCalledTimes(1)
    console.warn = warn
  })
})
