import Vue from 'vue'
import VueRouter from 'vue-router'
import { whiteRoutes, routeMap } from './router'
import store from '_store'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: whiteRoutes
})
router.beforeEach((to, from, next) => {
  // TODO: 加载开始
  // iView.LoadingBar.start()
  // 所有的路由必须有name 利用name做路由认证
  if (to.meta === undefined || to.meta.length === 0 || !to.meta.route) {
    console.log(store.getters['auth/isAuth'])
    if (store.getters['auth/isAuth']) {
      if (store.getters['auth/router'] === null) {
        console.log('123')
        let routers = routeMap[store.getters['auth/rule']]
        router.addRoutes([routers])
        store.commit('auth/SET_ROUTER', routers)
        console.log(store.getters['auth/router'])
        next({ ...to, replace: true })
      } else {
        // 已登陆并拉取权限表 前往错误页面
        next({ name: 'error' })
      }
    } else {
      // 未登录 前往登陆页面
      next({ name: 'login' })
    }
  } else {
    next()
  }
})

router.afterEach(route => {
  // iView.LoadingBar.finish()
  // TODO: 加载完成
  window.document.title = route.meta.title || 'admin'
})

export default router
