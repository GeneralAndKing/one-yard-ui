import Home from '_v//Home'
export default {
  path: '/home',
  component: Home,
  redirect: '/home/dashboard',
  children: [
    {
      path: 'dashboard',
      name: 'dashboard',
      meta: {
        name: '仪表盘',
        icon: 'dashboard'
      },
      component: () => import(/* webpackChunkName: "dashboard" */ '_v/dashboard')
    },
    {
      path: 'sysUser',
      name: 'sysUser',
      meta: {
        meta: '用户管理',
        icon: 'account_circle'
      },
      component: () => import(/* webpackChunkName: "sys-user" */ '_v/sys-user')
    },
    {
      path: 'sysRole',
      name: 'sysRole',
      meta: {
        meta: '角色管理',
        icon: 'mdi-account-badge-horizontal-outline'
      },
      component: () => import(/* webpackChunkName: "sys-role" */ '_v/sys-role')
    },
    {
      path: 'sysPermission',
      name: 'sysPermission',
      meta: {
        meta: '权限管理',
        icon: 'how_to_vote'
      },
      component: () => import(/* webpackChunkName: "sys-permission" */ '_v/sys-permission')
    },
    {
      path: 'sysDepartment',
      name: 'sysDepartment',
      meta: {
        meta: '部门管理',
        icon: 'how_to_vote'
      },
      component: () => import(/* webpackChunkName: "sys-department" */ '_v/sys-department')
    }
  ]
}
