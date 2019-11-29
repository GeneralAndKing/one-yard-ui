import Home from '_v//Home'
import Error from '_v//Error'
import { Role } from '_u/role'
export const routes = [
  {
    path: '/login',
    name: 'login',
    meta: { auth: [Role.ROLE_PUBLIC],
      meta: '登陆' },
    component: () => import(/* webpackChunkName: "login" */ '_v/auth/login')

  },
  {
    path: '/register',
    name: 'register',
    meta: { auth: [Role.ROLE_PUBLIC],
      meta: '注册' },
    component: () => import(/* webpackChunkName: "register" */ '_v/auth/register')
  },
  {
    path: '/forget',
    name: 'forget',
    meta: { auth: [Role.ROLE_PUBLIC],
      meta: '忘记密码' },
    component: () => import(/* webpackChunkName: "about" */ '_v/auth/forget')
  },
  {
    path: '/',
    component: Home,
    name: 'home',
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'index',
        meta: {
          meta: '欢迎使用',
          auth: Role.all()
        },
        component: () => import(/* webpackChunkName: "dashboard" */ '_v/index')
      },
      {
        path: 'userSetting',
        name: 'userSetting',
        meta: {
          meta: '个人设置',
          auth: Role.all()
        },
        component: () => import(/* webpackChunkName: "dashboard" */ '_v/user-setting')
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: {
          meta: '仪表盘',
          auth: [Role.ROLE_ADMIN]

        },
        component: () => import(/* webpackChunkName: "dashboard" */ '_v/admin/dashboard')
      },
      {
        path: 'sysUser',
        name: 'sysUser',
        meta: {
          meta: '用户管理',
          auth: [ Role.ROLE_ADMIN,
            Role.ROLE_PRODUCTION_SUPERVISOR,
            Role.ROLE_WORKSHOP_SUPERVISOR,
            Role.ROLE_WAREHOUSE_SUPERVISOR,
            Role.ROLE_PROCUREMENT_SUPERVISOR,
            Role.ROLE_FINANCE_SUPERVISOR]
        },
        component: () => import(/* webpackChunkName: "sys-user" */ '_v/admin/sys-user')
      },
      {
        path: 'sysRole',
        name: 'sysRole',
        meta: {
          meta: '角色管理',
          auth: [Role.ROLE_ADMIN]
        },
        component: () => import(/* webpackChunkName: "sys-role" */ '_v/admin/sys-role')
      },
      {
        path: 'sysPermission',
        name: 'sysPermission',
        meta: {
          meta: '权限管理',
          auth: [Role.ROLE_ADMIN]
        },
        component: () => import(/* webpackChunkName: "sys-permission" */ '_v/admin/sys-permission')
      },
      {
        path: 'sysDepartment',
        name: 'sysDepartment',
        meta: {
          meta: '部门管理',
          auth: [Role.ROLE_ADMIN]
        },
        component: () => import(/* webpackChunkName: "sys-department" */ '_v/admin/sys-department')
      },
      {
        path: 'sysLog',
        name: 'sysLog',
        meta: {
          meta: '日志管理',
          auth: [Role.ROLE_ADMIN]
        },
        component: () => import(/* webpackChunkName: "sys-department" */ '_v/admin/sys-log')
      }, {
        path: 'materialPlanCreate',
        name: 'materialPlanCreate',
        meta: {
          meta: '需求计划创建',
          auth: [Role.ROLE_PRODUCTION_PLANER,
            Role.ROLE_WAREHOUSE_PLANER,
            Role.ROLE_FINANCE_PLANER,
            Role.ROLE_WORKSHOP_PLANER]
        },
        component: () => import(/* webpackChunkName: "sys-department" */ '_v/material-plan/create')
      }, {
        path: 'materialPlanManagement',
        name: 'materialPlanManagement',
        meta: {
          meta: '需求计划表管理',
          auth: [
            Role.ROLE_PRODUCTION_PLANER,
            Role.ROLE_WAREHOUSE_PLANER,
            Role.ROLE_FINANCE_PLANER,
            Role.ROLE_WORKSHOP_PLANER,
            Role.ROLE_WORKSHOP_SUPERVISOR,
            Role.ROLE_FINANCE_SUPERVISOR,
            Role.ROLE_WAREHOUSE_SUPERVISOR,
            Role.ROLE_PRODUCTION_SUPERVISOR
          ]
        },
        component: () => import(/* webpackChunkName: "sys-department" */ '_v/material-plan/management')
      }, {
        path: 'procurementPlanManagement',
        name: 'procurementPlanManagement',
        meta: {
          meta: '采购计划管理',
          auth: [
            Role.ROLE_PROCUREMENT_PLANER,
            Role.ROLE_PROCUREMENT_SUPERVISOR,
            Role.ROLE_FINANCE,
            Role.ROLE_FINANCE_PLANER,
            Role.ROLE_FINANCE_SUPERVISOR
          ]
        },
        component: () => import(/* webpackChunkName: "sys-department" */ '_v/procurement-plan/management')
      }, {
        path: 'summary',
        name: 'summary',
        meta: {
          meta: '物资供应方案',
          auth: [
            Role.ROLE_PROCUREMENT_PLANER
          ]
        },
        component: () => import(/* webpackChunkName: "sys-department" */ '_v/procurement-plan/summary')
      }, {
        path: 'supplier',
        name: 'supplier',
        meta: {
          meta: '供应商管理',
          auth: [
            Role.ROLE_ADMIN
          ]
        },
        component: () => import(/* webpackChunkName: "sys-department" */ '_v/base/supplier')
      },
      {
        path: 'inventory',
        name: 'inventory',
        meta: {
          meta: '仓库组织管理',
          auth: [
            Role.ROLE_ADMIN
          ]
        },
        component: () => import(/* webpackChunkName: "sys-department" */ '_v/base/inventory')
      },
      {
        path: 'materialType',
        name: 'materialType',
        meta: {
          meta: '物料类别管理',
          auth: [
            Role.ROLE_ADMIN
          ]
        },
        component: () => import(/* webpackChunkName: "sys-department" */ '_v/base/materialType')
      },
      {
        path: 'material',
        name: 'material',
        meta: {
          meta: '物料管理',
          auth: [
            Role.ROLE_ADMIN
          ]
        },
        component: () => import(/* webpackChunkName: "sys-department" */ '_v/base/material')
      },
      {
        path: 'print',
        name: 'print',
        meta: {
          meta: '数据打印',
          auth: [
            Role.ROLE_PRODUCTION_PLANER,
            Role.ROLE_WAREHOUSE_PLANER,
            Role.ROLE_FINANCE_PLANER,
            Role.ROLE_WORKSHOP_PLANER,
            Role.ROLE_PROCUREMENT_PLANER,
            Role.ROLE_WORKSHOP_SUPERVISOR,
            Role.ROLE_FINANCE_SUPERVISOR,
            Role.ROLE_WAREHOUSE_SUPERVISOR,
            Role.ROLE_PRODUCTION_SUPERVISOR
          ]
        },
        component: () => import(/* webpackChunkName: "sys-department" */ '_v/print')
      },
      {
        path: 'procurementOrderCreate',
        name: 'procurementOrderCreate',
        meta: {
          meta: '采购订单创建',
          auth: [
            Role.ROLE_PROCUREMENT_PLANER
          ]
        },
        component: () => import(/* webpackChunkName: "sys-department" */ '_v/procurement-order/create')
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
