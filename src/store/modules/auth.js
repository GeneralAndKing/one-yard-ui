import * as oauthAPI from '_api/oauth'
import { Role } from '../../utils/role'

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
    if (state.auth === null) {
      return true
    }

    let expiredTime = new Date(state.auth.exp).getTime()
    /* 获取本地时间 */
    let nowTime = new Date().getTime() / 1000
    // /* 获取校验时间差 */
    // let diffTime = JSON.parse(sessionStorage.diffTime)
    // /* 校验本地时间 */
    // nowTime -= diffTime
    /* 如果 < 10分钟，则说明即将过期 */
    return (expiredTime - nowTime) < (60 * 60 * 5)
  }
}
const mutations = {
  SET_TOKEN (state, params) {
    state.token = params
  },
  SET_AUTH (state, auth) {
    state.auth = auth
    auth.authorities.forEach((item) => {
      if (Role.hasOwnProperty(item)) {
        console.log(Role[item])
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
    state.role = null
  }

}
const actions = {
  oauthLogin ({ commit, dispatch }, formUser) {
    return new Promise(async (resolve, reject) => {
      const res = await oauthAPI.oauthToken(formUser)
      if (res === null) return reject(new Error('请求失败'))
      let token = res.data
      if (token === null) return reject(new Error('请求失败'))
      commit('SET_TOKEN', token)
      resolve(token) // 接口请求完成
    })
  },
  checkToken ({ commit, dispatch, state }) {
    return new Promise(async (resolve, reject) => {
      const res = await oauthAPI.checkToken(state.token.access_token)
      if (res === null) return reject(new Error('请求失败'))
      commit('SET_AUTH', res.data)
      resolve(res.data) // 接口请求完成
    })
  },
  getMe ({ commit }) {
    return new Promise(async (resolve, reject) => {
      const res = await oauthAPI.getMe()
      if (res === null) return reject(new Error('请求失败'))
      commit('SET_ME', res.data.me)
      resolve(res.data) // 接口请求完成
    })
  },
  refreshToken ({ commit, dispatch, state }) {
    return new Promise(async (resolve, reject) => {
      const res = await oauthAPI.refreshToken(state.token.refresh_token)
      if (res === null) return reject(new Error('请求失败'))
      commit('SET_AUTH', res.data)
      resolve(res.data) // 接口请求完成
    })
  },
  logout ({ commit }) {
    commit('LOGOUT')
  }
}

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions
}
