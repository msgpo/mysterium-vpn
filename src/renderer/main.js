import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import {ipcRenderer} from 'electron'
import communication from '../app/communication'
import bugReporter from '../main/bug-reporting'
let raven = bugReporter.renderer.install(Vue)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  components: {App},
  router,
  store,
  template: '<App/>'
}).$mount('#app')

window.addEventListener('unhandledrejection', (evt) => {
  raven.captureException(evt.reason, {
    extra: evt.reason.response ? evt.reason.response.data : evt.reason
  })
})

ipcRenderer.on(communication.MYSTERIUM_CLIENT_LOG, (evt, log) => {
  bugReporter.pushToLogCache(log)
})
