import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    //存取token
    token: '',
    userInfo: {}
  },
  mutations: {
    // 唯一同步更新数据的地方
    updateToken (state, newtoken) {
      state.token = newtoken
    },
    updateUserInfo (state, info) {
      state.userInfo = info
    }
  },
  //异步操作数据的地方
  actions: {
    async initUserinfo (context) {
      const { data: res } = await axios.get('/my/userinfo')
      if (res.code === 0) {
        context.commit('updateUserInfo', res.data)
      }
    }
  },
  //模块化
  modules: {}
})
