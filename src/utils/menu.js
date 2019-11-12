import { Role, checkPermissions } from './role'
import store from '_store'
export const MENUS = [
  {
    to: { name: 'dashboard' },
    icon: 'dashboard',
    text: '仪表盘',
    auth: [Role.ROLE_ADMIN]
  },
  {
    text: '用户管理',
    icon: 'account_circle',
    to: { name: 'sysUser' },
    auth: [Role.ROLE_ADMIN]
  },
  // {
  //   text: '角色管理',
  //   to: { name: 'sysRole' },
  //   icon: 'mdi-account-badge-horizontal-outline',
  //   auth: [Role.ROLE_ADMIN]
  // },
  {
    text: '权限管理',
    to: { name: 'sysPermission' },
    icon: 'how_to_vote',
    auth: [Role.ROLE_ADMIN]
  },
  {
    text: '部门管理',
    to: { name: 'sysDepartment' },
    icon: 'how_to_vote',
    auth: [Role.ROLE_ADMIN]
  }, {
    name: '计划表',
    children: [
      {
        text: '计划表管理',
        to: { name: 'materialPlanManagement' },
        icon: 'location_city',
        auth: [
          Role.ROLE_PRODUCTION_PLANER,
          Role.ROLE_WAREHOUSE_PLANER,
          Role.ROLE_FINANCE_PLANER
        ]
      },
      {
        text: '计划表创建',
        to: { name: 'materialPlanCreate' },
        meta: '计划表创建',
        icon: 'location_city',
        auth: [
          Role.ROLE_PRODUCTION_PLANER,
          Role.ROLE_WAREHOUSE_PLANER,
          Role.ROLE_FINANCE_PLANER
        ]
      }
    ]
  }, {
    name: '汇总表',
    children: [
      {
        text: '汇总表管理',
        to: { name: 'Summary' },
        icon: 'location_city',
        auth: [
          Role.ROLE_PROCUREMENT_PLANER
        ]
      }
    ]
  }
]

/**
 * 生成左侧菜单栏
 * @param menus 总菜单
 * @returns {{children: []}}
 */
export const genMenu = (menus = MENUS) => {
  if (menus === null) {
    return null
  }
  let result = []
  if (!(menus instanceof Array)) {
    menus = [menus]
  }
  menus.forEach((item) => {
    if (item.name) {
      let children = genMenu(item.children)
      if (children.length !== 0) {
        result.push({
          name: item.name,
          children: children
        })
      }
    } else if (checkPermissions(item.auth, store.getters['auth/role'])) {
      result.push({
        icon: item.icon,
        text: item.text,
        to: item.to
      })
    }
  })
  return result
}
