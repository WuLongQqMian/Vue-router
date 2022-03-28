import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/Home/Home.vue'
import User from '@/views/User/User.vue'

// 使用插件
Vue.use(VueRouter)

// 路由规则的数组
const routes = [
  { path: '/', component: Home, mata: { isRecord: true, top: 0 } },
  { path: '/user', component: User }
]

// 创建路由实例对象
const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: to.meta.top || 0 }
    }
  }
})

export default router
