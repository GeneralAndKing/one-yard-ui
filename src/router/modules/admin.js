import Home from '_v//Home'
export default {
  path: '/home',
  component: Home,
  name: 'home',
  redirect: '/home/dashboard',
  children: [
    {
      path: 'dashboard',
      name: 'dashboard',
      meta: {
        route: true,
        menu: true,
        meta: '仪表盘',
        icon: 'dashboard'

      },
      component: () => import(/* webpackChunkName: "dashboard" */ '_v/admin/dashboard')
    },
    {
      path: 'sysUser',
      name: 'sysUser',
      meta: {
        route: true,
        menu: true,
        meta: '用户管理',
        icon: 'account_circle'
      },
      component: () => import(/* webpackChunkName: "sys-user" */ '_v/admin/sys-user')
    },
    {
      path: 'sysRole',
      name: 'sysRole',
      meta: {
        route: true,
        meta: '角色管理',
        icon: 'mdi-account-badge-horizontal-outline'
      },
      component: () => import(/* webpackChunkName: "sys-role" */ '_v/admin/sys-role')
    },
    {
      path: 'sysPermission',
      name: 'sysPermission',
      meta: {
        route: true,
        menu: true,
        meta: '权限管理',
        icon: 'how_to_vote'
      },
      component: () => import(/* webpackChunkName: "sys-permission" */ '_v/admin/sys-permission')
    },
    {
      path: 'sysDepartment',
      name: 'sysDepartment',
      meta: {
        route: true,
        menu: true,
        meta: '部门管理',
        icon: 'how_to_vote'
      },
      component: () => import(/* webpackChunkName: "sys-department" */ '_v/admin/sys-department')
    },
    { name: '计划表',
      children: [{
        path: 'materialPlanCreate',
        name: 'materialPlanCreate',
        meta: {
          route: true,
          menu: true,
          meta: '创建计划表',
          icon: 'location_city'
        },
        component: () => import(/* webpackChunkName: "sys-department" */ '_v/material-plan')
      }] }

  ]
}
