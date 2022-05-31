import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//引入axios
import axios from 'axios'
//引入 ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/global.less'
//设置根路径
axios.defaults.baseURL = 'https://big-event-vue-api-t.itheima.net'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (config.url.startsWith('/my')) {
    config.headers.Authorization = store.state.token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  if (error.response.status === 401) {
    //清空token 清空用户信息
    store.commit('updateUserInfo', {})
    store.commit('updateToken', '')
    //跳转到首页
    router.push('/login') //.catch(err => err)
  }
  return Promise.reject(error)
})
//将axios挂载到 vue构造函数的原型对象上 prototype
Vue.prototype.$http = axios
//注册 ElementUI
Vue.use(ElementUI)
// 全局注册富文本编辑器
Vue.use(VueQuillEditor)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
