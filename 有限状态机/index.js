/*
 * @Author: simonyang
 * @Date: 2022-06-03 13:27:41
 * @LastEditTime: 2022-06-03 14:18:22
 * @LastEditors: simonyang
 * @Description:
 */
function test(string) {
  let i
  let startIndex
  let endIndex
  const result = []

  function waitForA(char) {
    if (char === 'a') {
      startIndex = i
      return waitForB
    }
    return waitForA
  }
  function waitForB(char) {
    if (char === 'b') {
      return waitForC
    }
    return waitForA
  }
  function waitForC(char) {
    if (char === 'c' || char === 'd') {
      endIndex = i
      return end
    }
    return waitForA
  }
  function end() {
    return end
  }

  let currentState = waitForA

  for (i = 0; i < string.length; i++) {
    const nextState = currentState(string[i])
    currentState = nextState

    if (currentState === end) {
      result.push({
        start: startIndex,
        end: endIndex,
        string: string.slice(startIndex, endIndex + 1),
      })
      currentState = waitForA
    }
  }
  return result
}

console.log(test('abaabdccsbabcsssdff'))
