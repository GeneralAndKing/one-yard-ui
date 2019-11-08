import Vue from 'vue'
import VueRouter from 'vue-router'
import { whiteRoutes, routeMap } from './router'
import store from '_store'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: whiteRoutes
})
router.beforeEach((to, from, next) => {
  console.log('asd')
  // TODO: 加载开始
  // iView.LoadingBar.start()
  // 所有的路由必须有name 利用name做路由认证
  if (to.meta === undefined || to.meta.length === 0 || !to.meta.route) {
    if (store.getters['auth/isAuth']) {
      console.log(store.getters['auth/refresh'])
      if (store.getters['auth/router'] === null) {
        let routers = routeMap[store.getters['auth/rule']]
        router.addRoutes([routers])
        store.commit('auth/SET_ROUTER', routers)
        next({ ...to, replace: true })
      } else {
        // 已登陆并拉取权限表 前往错误页面
        next({ name: 'home' })
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
