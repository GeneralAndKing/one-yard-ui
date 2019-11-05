import White from '_v/White.vue'
export default {
  path: '/auth',
  name: 'auth',
  component: White,
  redirect: '/auth/login',
  children: [
    {
      path: 'login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '_v/pages/Login.vue')
    },
    {
      path: 'register',
      name: 'register',
      component: () => import(/* webpackChunkName: "register" */ '_v/pages/Register.vue')
    },
    {
      path: 'forget',
      name: 'forget',
      component: () => import(/* webpackChunkName: "about" */ '_v/pages/Forget.vue')
    }
  ]
}
