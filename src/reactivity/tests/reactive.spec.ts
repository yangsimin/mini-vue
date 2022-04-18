/*
 * @Author: simonyang
 * @Date: 2022-04-18 14:29:31
 * @LastEditTime: 2022-04-18 22:36:52
 * @LastEditors: simonyang
 * @Description:
 */
import { reactive, isReactive, isReadonly } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(1)

    expect(isReactive(observed)).toBe(true)
    expect(isReactive(original)).toBe(false)
    expect(isReactive(undefined)).toBe(false)

    expect(isReadonly(observed)).toBe(false)
    expect(isReadonly(original)).toBe(false)
    expect(isReadonly(undefined)).toBe(false)
  })
})
