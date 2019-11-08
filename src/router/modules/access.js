import Home from '_v//Home'
export default {
  path: '/home',
  component: Home,
  name: 'home',
  redirect: '/home/index',
  children: [
    {
      path: 'index',
      name: 'index',
      meta: {
        route: true,
        meta: '欢迎使用',
        icon: 'dashboard'

      },
      component: () => import(/* webpackChunkName: "dashboard" */ '_v/access/index')
    }
  ]
}
