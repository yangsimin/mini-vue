/*
 * @Author: simonyang
 * @Date: 2022-04-19 15:15:06
 * @LastEditTime: 2022-04-19 17:06:50
 * @LastEditors: simonyang
 * @Description:
 */
import { createApp } from '../../lib/guide-mini-vue.esm.js'
import { App } from './App.js'

const rootContainer = document.querySelector('#app')
createApp(App).mount(rootContainer)
