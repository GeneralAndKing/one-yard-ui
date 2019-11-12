import Home from '_v//Home'
import Error from '_v//Error'
import { Role } from '../utils/role'
export const routes = [
  {
    path: '/login',
    name: 'login',
    meta: { auth: [Role.ROLE_PUBLIC] },
    component: () => import(/* webpackChunkName: "login" */ '_v/auth/login')

  },
  {
    path: '/register',
    name: 'register',
    meta: { auth: [Role.ROLE_PUBLIC] },
    component: () => import(/* webpackChunkName: "register" */ '_v/auth/register')
  },
  {
    path: '/forget',
    name: 'forget',
    meta: { auth: [Role.ROLE_PUBLIC] },
    component: () => import(/* webpackChunkName: "about" */ '_v/auth/forget')
  },
  {
    path: '/home',
    component: Home,
    name: 'home',
    redirect: '/home/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: {
          meta: '仪表盘',
          icon: 'dashboard',
          auth: [Role.ROLE_ADMIN]

        },
        component: () => import(/* webpackChunkName: "dashboard" */ '_v/admin/dashboard')
      },
      {
        path: 'sysUser',
        name: 'sysUser',
        meta: {
          meta: '用户管理',
          icon: 'account_circle',
          auth: [Role.ROLE_ADMIN]
        },
        component: () => import(/* webpackChunkName: "sys-user" */ '_v/admin/sys-user')
      },
      {
        path: 'sysRole',
        name: 'sysRole',
        meta: {
          meta: '角色管理',
          icon: 'mdi-account-badge-horizontal-outline',
          auth: [Role.ROLE_ADMIN]
        },
        component: () => import(/* webpackChunkName: "sys-role" */ '_v/admin/sys-role')
      },
      {
        path: 'sysPermission',
        name: 'sysPermission',
        meta: {
          meta: '权限管理',
          icon: 'how_to_vote',
          auth: [Role.ROLE_ADMIN]
        },
        component: () => import(/* webpackChunkName: "sys-permission" */ '_v/admin/sys-permission')
      },
      {
        path: 'sysDepartment',
        name: 'sysDepartment',
        meta: {
          meta: '部门管理',
          icon: 'how_to_vote',
          auth: [Role.ROLE_ADMIN]
        },
        component: () => import(/* webpackChunkName: "sys-department" */ '_v/admin/sys-department')
      }, {
        path: 'materialPlanCreate',
        name: 'materialPlanCreate',
        meta: {
          meta: '计划表创建',
          icon: 'location_city',
          auth: [Role.ROLE_ADMIN]
        },
        component: () => import(/* webpackChunkName: "sys-department" */ '_v/material-plan-create')
      }, {
        path: 'materialPlanManagement',
        name: 'materialPlanManagement',
        meta: {
          meta: '计划表管理',
          icon: 'location_city',
          auth: [
            Role.ROLE_PRODUCTION_PLANER,
            Role.ROLE_WAREHOUSE_PLANER,
            Role.ROLE_FINANCE_PLANER
          ]
        },
        component: () => import(/* webpackChunkName: "sys-department" */ '_v/material-plan-management')
      }, {
        path: 'Summary',
        name: 'Summary',
        meta: {
          meta: '汇总表管理',
          icon: 'location_city',
          auth: [
            Role.ROLE_PROCUREMENT_PLANER
          ]
        },
        component: () => import(/* webpackChunkName: "sys-department" */ '_v/summary')
      }

    ]
  },
  {
    path: '/error',
    component: Error,
    name: 'error',
    meta: {
      auth: [
        Role.ROLE_PUBLIC
      ]
    }
  }

]
