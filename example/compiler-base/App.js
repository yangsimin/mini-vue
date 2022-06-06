/*
 * @Author: simonyang
 * @Date: 2022-06-06 19:25:57
 * @LastEditTime: 2022-06-06 19:26:27
 * @LastEditors: simonyang
 * @Description:
 */
export const App = {
  name: 'App',
  template: `<div>hi,{{message}}</div>`,
  setup() {
    return {
      message: 'mini-vue',
    }
  },
}
