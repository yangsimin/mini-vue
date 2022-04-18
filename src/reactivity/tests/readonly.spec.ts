/*
 * @Author: simonyang
 * @Date: 2022-04-18 19:56:17
 * @LastEditTime: 2022-04-18 22:37:13
 * @LastEditors: simonyang
 * @Description:
 */
import { isReactive, isReadonly, readonly } from '../reactive'

describe('readonly', () => {
  it('happy path', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)

    wrapped.foo = 2
    expect(wrapped.foo).toBe(1)

    expect(isReadonly(wrapped)).toBe(true)
    expect(isReactive(original)).toBe(false)
  })

  it('warn then call set', () => {
    const user = readonly({
      age: 10,
    })
    const warn = console.warn
    console.warn = jest.fn()
    user.age = 11
    expect(console.warn).toBeCalledTimes(1)
    console.warn = warn
  })
})
