import Vue from 'vue'
import VueRouter from 'vue-router'
import Reg from '@/views/Reg/Reg'
import Login from '@/views/Login/Login'
import Main from '@/views/Main/Main'

Vue.use(VueRouter)

//路由配置规则
const routes = [
  {
    path: '/reg', component: Reg
  },
  {
    path: '/login', component: Login
  },
  {
    path: '/', component: Main
  }
]

const router = new VueRouter({
  routes
})

export default router
