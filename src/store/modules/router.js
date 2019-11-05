import { routeMap } from '_route/router'

const state = {
  routers: []
}

const getters = {
  hasGetRules: state => {
    return state.routers.length !== 0
  }
}

const mutations = {
  CONCAT_ROUTES (state, rulesList) {
    // 必须 routes 在后面
    state.routers = state.routers.concat(rulesList)
  }
}

const actions = {
  /**
   * 路由拼接
   * 请求到的路由规则，与公共资源进行拼接
   *
   * @param commit
   * @param rules
   * @returns {Promise<any>}
   */
  concatRoutes ({ commit }, rules) {
    return new Promise((resolve, reject) => {
      try {
        let rulesList = []
        console.log(rules)
        if (Object.entries(rules).every(item => item[1])) {
          // 如果全都为 true，那么直接赋值过来
          rulesList = routeMap
        } else {
          // 如果有一个不为 true，就获取能够访问的路由列表
          rulesList = getAccessRouterList(routeMap, rules)
        }
        // 更改 state 的 mutations
        commit('CONCAT_ROUTES', rulesList)
        // 把路由规则返回回去
        resolve(state.routers)
      } catch (error) {
        reject(error)
      }
    })
  }
}

/**
 * 获取到有权限访问的路由信息
 *
 * @param routes 所有需要进行权限验证的路由
 * @param rules 从后端请求过来的路由规则
 * @returns {*} 允许访问的的路由规则
 */
const getAccessRouterList = (routes, rules) => {
  return routes.filter(item => {
    // 获取到对应的路由的值
    if (rules[item.name]) {
      // 如果路由有子节点，就递归
      if (item.children) item.children = getAccessRouterList(item.children, rules)
      return true
    } else {
      return false
    }
  })
}

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions
}
