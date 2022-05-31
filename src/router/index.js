import Vue from 'vue'
import VueRouter from 'vue-router'
import Reg from '@/views/Reg/Reg'
import Login from '@/views/Login/Login'
import Main from '@/views/Main/Main'
import Home from '@/views/Menus/Home/Home'
import UserInfo from '@/views/Menus/User/UserInfo'
import UserAvatar from '@/views/Menus/User/UserAvatar'
import UserPwd from '@/views/Menus/User/UserPwd'
import ArtCate from '@/views/Menus/Article/ArtCate'
import ArtList from '@/views/Menus/Article/ArtList'
// 把下面的代码粘贴到路由模块中对应的位置，即可防止路由报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
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
    path: '/', component: Main,
    //路由重定向
    redirect: '/home',
    children: [
      { path: 'home', component: Home },
      { path: 'user-info', component: UserInfo },
      { path: 'user-avatar', component: UserAvatar },
      { path: 'user-pwd', component: UserPwd },
      { path: 'art-cate', component: ArtCate },
      { path: 'art-list', component: ArtList }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
