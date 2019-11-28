import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from './router'
import store from '_store'
import { Role, checkPermissions } from '_u/role'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: routes
})
router.beforeEach((to, from, next) => {
  // TODO: 加载开始
  Vue.prototype.$loading.start()
  if (store.getters['auth/isAuth']) {
    if (to.meta === {} || to.meta.auth === undefined) {
      next({ name: 'error',
        query: {
          text: '页面不存在',
          code: 404
        },
        replace: true })
    } else if (to.meta.auth.includes(Role.ROLE_PUBLIC)) {
      next()
    } else if (checkPermissions(to.meta.auth, store.getters['auth/role'])) {
      next()
    } else {
      next({ name: 'error',
        query: {
          text: '你没有权限访问',
          code: 403
        },
        replace: true })
    }
  } else if (to.meta !== {} && to.meta.auth !== undefined && to.meta.auth.includes(Role.ROLE_PUBLIC)) {
    next()
  } else {
    // 未登录 前往登陆页面
    next({ name: 'login' })
  }
})

router.afterEach(route => {
  // iView.LoadingBar.finish()

  setTimeout(() => {
    Vue.prototype.$loading.finish()
  }, 1000)
  // TODO: 加载完成
  window.document.title = route.meta.meta || '一码当先'
})

export default router
