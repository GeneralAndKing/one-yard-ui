
export default [
  {
    path: '/login',
    name: 'login',
    meta: { route: true },
    component: () => import(/* webpackChunkName: "login" */ '_v/auth/login')

  },
  {
    path: '/register',
    name: 'register',
    meta: { route: true },
    component: () => import(/* webpackChunkName: "register" */ '_v/auth/register')
  },
  {
    path: '/forget',
    name: 'forget',
    meta: { route: true },
    component: () => import(/* webpackChunkName: "about" */ '_v/auth/forget')
  }
]
