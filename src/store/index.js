import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import createVuexAlong from 'vuex-along'
import sundry from './modules/sundry'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth, sundry
  },
  plugins: [
    createVuexAlong({
      name: 'vuex-auth', // 设置保存的集合名字，避免同站点下的多项目数据冲突
      local: {
        list: ['auth', 'sundry']
      }
    })
  ]
})
