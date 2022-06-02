/*
 * @Author: simonyang
 * @Date: 2022-06-02 09:31:19
 * @LastEditTime: 2022-06-02 10:36:56
 * @LastEditors: simonyang
 * @Description:
 */
const queue: any[] = []
const p = Promise.resolve()
// 判断是否已经存在微任务
let isFlushPending = false

export function nextTick(fn) {
  return fn ? p.then(fn) : p
}

export function queueJobs(job) {
  if (!queue.includes(job)) {
    queue.push(job)
  }
  queueFlush()
}

function queueFlush() {
  if (isFlushPending) return
  isFlushPending = true

  nextTick(flushJobs)
}

function flushJobs() {
  isFlushPending = false
  let job
  while ((job = queue.shift())) {
    job && job()
  }
}
