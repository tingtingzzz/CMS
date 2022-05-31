import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import user from '@/store/user'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    //存取token
    token: '',
    userInfo: {}
  },
  mutations: {},
  //异步操作数据的地方
  actions: {},
  //模块化
  modules: {
    user
  }
})
