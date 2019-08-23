import Vue from 'vue'
import App from './App.vue'
import '@/styles/index.less'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from '@/router/router.js'
Vue.use(ElementUI)
router.beforeEach((to, form, next) => {
  // 取到token
  let mytoken = localStorage.getItem('itcast_manager_token')
  if (mytoken || to.path === '/login') {
    next()
  } else {
    next({ path: '/login' })
  }
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
