// 1.引入
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import Welcome from '@/views/welcome.vue'
import User from '@/views/users/user.vue'
import rigthList from '@/views/rigths/rigthList.vue'
import roleList from '@/views/rigths/roleList.vue'
import goodList from '@/views/goods/list.vue'
// use
Vue.use(VueRouter)
export default new VueRouter({
  routes: [
    {
      name: 'default',
      path: '/',
      redirect: { name: 'login' }
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      redirect: { name: 'welcome' },
      children: [
        {
          name: 'welcome',
          path: 'welcome',
          component: Welcome
        },
        {
          name: 'users',
          path: 'users',
          component: User
        },
        {
          name: 'rigthList',
          path: 'rigthList',
          component: rigthList
        },
        {
          name: 'roles',
          path: 'roles',
          component: roleList
        },
        {
          name: 'goodList',
          path: 'goodList',
          component: goodList
        }
      ]
    }
  ]
})
