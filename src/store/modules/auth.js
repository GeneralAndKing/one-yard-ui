import Vue from 'vue'
import * as oauthAPI from '_api/oauth'
import { Role } from '_u/role'
import { to } from '_u/util'
import router from '_router'
const state = {
  token: null,
  // 授权信息，来源于 checkToken
  auth: null,
  role: [],
  me: null
}
const getters = {
  isAuth: state => {
    return state.token !== null && state.auth !== null
  },
  role: state => {
    return state.role
  },
  token: state => {
    return state.token
  },
  username: state => {
    return state.auth.user_name === null ? '' : state.auth.user_name
  },
  me: state => {
    return state.me
  },
  isTokenExpired: state => {
    /* 从localStorage中取出token过期时间 */
    if (state.token === null) {
      return false
    }
    if (state.auth === null || state.me === null) {
      return true
    }

    let expiredTime = new Date(state.auth.exp).getTime()
    /* 获取本地时间 */
    let nowTime = new Date().getTime() / 1000
    // /* 获取校验时间差 */
    // let diffTime = JSON.parse(sessionStorage.diffTime)
    // /* 校验本地时间 */
    // nowTime -= diffTime
    /* 如果 < 5个小时，则说明即将过期 */
    return (expiredTime - nowTime) < (60 * 60 * 5)
  }
}
const mutations = {
  SET_TOKEN (state, params) {
    state.token = params
  },
  SET_AUTH (state, auth) {
    state.auth = auth
    state.role = []
    if (!auth.hasOwnProperty('authorities') || auth.authorities.length === 0) {
      Vue.prototype.$message('当前用户没有任何角色，请联系系统管理员赋予角色！', 'error')
      return
    }
    auth.authorities.forEach((item) => {
      if (Role.hasOwnProperty(item)) {
        state.role.push(Role[item])
      }
    })
  },
  SET_ME (state, me) {
    state.me = me
  },
  // logout
  LOGOUT (state) {
    state.token = null
    state.user = null
    state.auth = null
    state.role = []
  }

}
const actions = {
  oauthLogin ({ commit, dispatch }, formUser) {
    return new Promise(async (resolve, reject) => {
      let err, res
      [err, res] = await to(oauthAPI.oauthToken(formUser))
      if (err) return reject(err.response)
      let token = res.data
      commit('SET_TOKEN', token)
      resolve(token) // 接口请求完成
    })
  },
  checkToken ({ commit, dispatch, state }) {
    return new Promise(async (resolve, reject) => {
      let err, res
      [err, res] = await to(oauthAPI.checkToken(state.token.access_token))
      if (err) {
        return reject(err.response)
      }
      commit('SET_AUTH', res.data)
      resolve(res.data) // 接口请求完成
    })
  },
  getMe ({ commit }) {
    return new Promise(async (resolve, reject) => {
      let err, res
      [err, res] = await to(oauthAPI.getMe())
      if (err) {
        return reject(err.response)
      }
      commit('SET_ME', res.data.me)
      resolve(res.data) // 接口请求完成
    })
  },
  refreshToken ({ commit, dispatch, state }) {
    return new Promise(async (resolve, reject) => {
      let err, res
      [err, res] = await to(oauthAPI.refreshToken(state.token.refresh_token))
      if (err) {
        return reject(err.response)
      }
      commit('SET_TOKEN', res.data)
      dispatch('checkToken')
      resolve(res.data) // 接口请求完成
    })
  },
  logout ({ commit }) {
    commit('LOGOUT')
    router.push({ name: 'login' })
  }
}

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions
}
