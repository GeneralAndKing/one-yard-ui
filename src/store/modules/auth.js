import * as oauthAPI from '_api/oauch'
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
    return state.auth.authorities[0]
  },
  token: state => {
    return state.token
  },
  router: state => {
    return state.router
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
    return new Promise((resolve, reject) => {
      oauthAPI.oauthToken(formUser).then(res => {
        let token = res.data
        if (token !== null) {
          // 登录完成后，获取用户信息，里面包括了路由权限和用户等信息
          commit('SET_TOKEN', token)
          resolve(res)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  checkToken ({ commit, dispatch }, token) {
    return new Promise((resolve, reject) => {
      oauthAPI.checkToken(token.access_token).then(res => {
        commit('SET_AUTH', res.data)
        commit('SET_USER', res.data.user_name)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
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
