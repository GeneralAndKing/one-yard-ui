import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import createVuexAlong from 'vuex-along'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth
  },
  plugins: [
    createVuexAlong({
      name: 'vuex-auth', // 设置保存的集合名字，避免同站点下的多项目数据冲突
      //  user: null,
      //   // token 信息，来源于 登录 或 刷新令牌
      //   token: null,
      //   // 授权信息，来源于 checkToken
      //   auth: null,
      //   router: null
      local: {
        list: ['auth.token', 'auth.user', 'auth.auth']
      }
    })
  ]
})
