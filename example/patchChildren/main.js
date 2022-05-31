/*
 * @Author: simonyang
 * @Date: 2022-05-27 15:01:25
 * @LastEditTime: 2022-05-27 15:08:15
 * @LastEditors: simonyang
 * @Description:
 */
import { App } from './App.js'
import { createApp } from '../../lib/guide-mini-vue.esm.js'

const container = document.body.querySelector('#app')
createApp(App).mount(container)
