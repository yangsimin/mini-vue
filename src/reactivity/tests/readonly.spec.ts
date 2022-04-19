/*
 * @Author: simonyang
 * @Date: 2022-04-18 19:56:17
 * @LastEditTime: 2022-04-19 10:43:18
 * @LastEditors: simonyang
 * @Description:
 */
import { isReactive, isReadonly, isProxy, readonly } from '../reactive'

describe('readonly', () => {
  it('happy path', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)

    expect(isReadonly(wrapped)).toBe(true)
    expect(isReactive(original)).toBe(false)
    expect(isReadonly(wrapped.bar)).toBe(true)
    expect(isReadonly(original.bar)).toBe(false)

    expect(isProxy(wrapped)).toBe(true)
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
