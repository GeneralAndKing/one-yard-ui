
const state = {
  theme: false
}
const getters = {
  theme: state => {
    return state.theme
  }
}
const mutations = {
  SET_THEME (state) {
    state.theme = !state.theme
  }
}
const actions = {
  changeTheme ({ commit, dispatch }) {
    commit('SET_THEME')
  }
}

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions
}
