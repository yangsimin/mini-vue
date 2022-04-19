/*
 * @Author: simonyang
 * @Date: 2022-04-18 14:29:31
 * @LastEditTime: 2022-04-19 14:19:22
 * @LastEditors: simonyang
 * @Description:
 */
import { reactive, isReactive, isReadonly, isProxy } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(1)
    observed.foo = 2
    expect(original.foo).toBe(2)
    expect(isReactive(observed)).toBe(true)
    expect(isReactive(original)).toBe(false)
    expect(isReactive(undefined)).toBe(false)

    expect(isReadonly(observed)).toBe(false)
    expect(isReadonly(original)).toBe(false)
    expect(isReadonly(undefined)).toBe(false)

    expect(isProxy(observed)).toBe(true)
  })
  it('nested reactive', () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }],
    }
    const observed = reactive(original)
    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.array)).toBe(true)
    expect(isReactive(observed.array[0])).toBe(true)
  })
})
