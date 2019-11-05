import * as oauthAPI from '../../api/oauch'

const state = {
  // 用户信息，来源于 oauthMe
  user: null,
  // token 信息，来源于 登录 或 刷新令牌
  token: null,
  // 授权信息，来源于 checkToken
  auth: null
}
const getters = {
  isAuth: state => {
    return state.token !== null
  },
  isAdmin: state => {
    return state.auth && state.auth.authorities.includes('ROLE_ADMIN')
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
  // logout
  LOGOUT (state) {
    state.token = null
    state.user = null
  }
}
const actions = {
  oauthLogin ({ commit, dispatch }, formUser) {
    return new Promise((resolve, reject) => {
      oauthAPI.oauthToken(formUser).then(res => {
        let token = res.data
        if (token !== null) {
          // 登录完成后，获取授权信息，里面包括了 token 有效期
          dispatch('checkToken', token)
          // 登录完成后，获取用户信息，里面包括了路由权限和用户等信息
          dispatch('oauthMe', token)
          commit('SET_TOKEN', token)
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  oauthMe ({ commit, dispatch }, token) {
    return new Promise((resolve, reject) => {
      oauthAPI.oauthMe(token.access_token).then(res => {
        commit('SET_USER', res.data)
      }).catch((error) => {
        // to do 信息展示
        // iView.Message.error('获取用户信息失败')
        console.log(error)
      })
    })
  },
  checkToken ({ commit, dispatch }, token) {
    return new Promise((resolve, reject) => {
      oauthAPI.checkToken(token.access_token).then(res => {
        commit('SET_AUTH', res.data)
      }).catch(() => {
        // to do 信息展示
        // iView.Message.error('获取授权信息失败')
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
