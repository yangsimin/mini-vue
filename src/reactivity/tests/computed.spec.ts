/*
 * @Author: simonyang
 * @Date: 2022-04-19 12:57:18
 * @LastEditTime: 2022-04-19 13:45:00
 * @LastEditors: simonyang
 * @Description:
 */
import { reactive } from '../reactive'
import { computed } from '../computed'

describe('computed', () => {
  it('happy path', () => {
    const user = reactive({
      age: 1,
    })
    const age = computed(() => {
      return user.age
    })

    expect(age.value).toBe(1)
  })

  it('should compute lazily', () => {
    const value = reactive({
      foo: 1,
    })
    const getter = jest.fn(() => {
      return value.foo
    })
    const cValue = computed(getter)

    // 测试 lazy 功能
    expect(getter).not.toHaveBeenCalled()
    expect(cValue.value).toBe(1)
    expect(getter).toBeCalledTimes(1)

    // 测试缓存功能
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)
    // 只在获取 getter.value 值时触发 computed, 否则不应该调用
    value.foo = 2
    expect(getter).toHaveBeenCalledTimes(1)

    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)

    cValue.value
    expect(getter).toHaveBeenCalledTimes(2)
  })
})
