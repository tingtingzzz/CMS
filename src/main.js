import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入axios
import axios from 'axios'
//引入 ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/global.less'
//设置根路径
axios.defaults.baseURL = 'http://www.liulongbin.top:3008'
//将axios挂载到 vue构造函数的原型对象上 prototype
Vue.prototype.$http = axios
//注册 ElementUI
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
