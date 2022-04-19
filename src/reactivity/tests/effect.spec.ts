/*
 * @Author: simonyang
 * @Date: 2022-04-18 14:25:35
 * @LastEditTime: 2022-04-19 09:42:48
 * @LastEditors: simonyang
 * @Description:
 */
import { effect, stop } from '../effect'
import { reactive } from '../reactive'

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 10,
    })

    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })
    expect(nextAge).toBe(11)

    // update
    user.age += 1
    expect(nextAge).toBe(12)
  })
  it.skip('happy path2', () => {
    const person = reactive({
      age: 10,
      child: {
        age: 1,
      },
    })
    let child
    effect(() => {
      child = person.child
    })
    expect(child.age).toBe(1)
    person.child = null
    expect(child).toBe(null)
  })

  it('should return runner when call effect', () => {
    let foo = 10
    const runner = effect(() => {
      foo++
      return 'foo'
    })

    expect(foo).toBe(11)
    const r = runner()
    expect(foo).toBe(12)
    expect(r).toBe('foo')
  })

  it('scheduler', () => {
    let dummy
    let run
    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler }
    )

    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)

    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(1)

    run()
    expect(dummy).toBe(2)
  })

  it('stop', () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
      return 'runner'
    })
    obj.prop = 2
    expect(dummy).toBe(2)

    stop(runner)
    // obj.prop = 3
    obj.prop++
    expect(dummy).toBe(2)

    const ret = runner()
    expect(dummy).toBe(3)
    expect(ret).toBe('runner')
  })

  it('onStop', () => {
    const obj = reactive({
      foo: 1,
    })
    const onStop = jest.fn()
    let dummy
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      {
        onStop,
      }
    )

    stop(runner)
    expect(onStop).toBeCalledTimes(1)
  })
})
