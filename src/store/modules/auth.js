import * as oauthAPI from '_api/oauth'

const state = {
  // 用户信息，来源于 oauthMe
  user: null,
  // token 信息，来源于 登录 或 刷新令牌
  token: null,
  // 授权信息，来源于 checkToken
  auth: null,
  router: null
}
const getters = {
  isAuth: state => {
    return state.token !== null
  },
  rule: state => {
    return (state.auth === null || state.auth.authorities === null || state.auth.authorities.length === 0) ? null : state.auth.authorities[0]
  },
  token: state => {
    return state.token
  },
  router: state => {
    console.log('dsdsd')
    return state.router
  },
  username: state => {
    return state.auth.user_name || null
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
  SET_USER (state, user) {
    state.user = user
  },
  SET_AUTH (state, auth) {
    state.auth = auth
  },
  SET_ROUTER (state, router) {
    state.router = router
  },
  // logout
  LOGOUT (state) {
    state.token = null
    state.user = null
    state.auth = null
  }
}
const actions = {
  oauthLogin ({ commit, dispatch }, formUser) {
    return oauthAPI.oauthToken(formUser).then(res => {
      let token = res.data
      if (token !== null) {
        // 登录完成后，获取用户信息，里面包括了路由权限和用户等信息
        commit('SET_TOKEN', token)
        return Promise.resolve(res)
      }
    }).catch(error => {
      return Promise.reject(error.response)
    })
  },
  checkToken ({ commit, dispatch }, accessToken) {
    return oauthAPI.checkToken(accessToken).then(res => {
      console.log('12312')
      commit('SET_AUTH', res.data)
      commit('SET_USER', res.data.user_name)
      return Promise.resolve(res)
    }).catch(error => {
      return Promise.reject(error.response)
    })
  },
  refreshToken ({ commit, dispatch }, refreshToken) {
    return oauthAPI.refreshToken(refreshToken).then(res => {
      commit('SET_AUTH', res.data)
      commit('SET_USER', res.data.user_name)
      return Promise.resolve(res)
    }).catch(error => {
      return Promise.reject(error.response)
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
