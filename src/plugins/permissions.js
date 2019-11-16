import Vue from 'vue'
import store from '_store'
import { checkPermissions } from '_u/role'
// 是否有权限
const hasPermission = auth => {
  let authList = Array.isArray(auth) ? auth : [auth]
  // 当前用户的权限列表
  let userRole = store.getters['auth/role']
  return checkPermissions(authList, userRole)
}

// 指令
Vue.directive('per', {
  bind: (el, binding, vnode) => {
    if (!hasPermission(binding.value)) {
      Vue.nextTick(() => {
        el.parentNode.removeChild(el)
      })
    }
  }
})

// 全局判断方法
Vue.prototype.$_has = hasPermission
