import { Role, checkPermissions } from './role'
import store from '_store'
export const MENUS = [
  {
    to: { name: 'dashboard' },
    icon: 'mdi-view-dashboard',
    text: '仪表盘',
    auth: [Role.ROLE_ADMIN]
  },
  {
    text: '用户管理',
    icon: 'mdi-account-circle',
    to: { name: 'sysUser' },
    auth: [
      Role.ROLE_ADMIN,
      Role.ROLE_PRODUCTION_SUPERVISOR,
      Role.ROLE_WORKSHOP_SUPERVISOR,
      Role.ROLE_WAREHOUSE_SUPERVISOR,
      Role.ROLE_PROCUREMENT_SUPERVISOR,
      Role.ROLE_FINANCE_SUPERVISOR
    ]
  },
  {
    text: '权限管理',
    to: { name: 'sysPermission' },
    icon: 'how_to_vote',
    auth: [Role.ROLE_ADMIN]
  },
  {
    text: '部门管理',
    to: { name: 'sysDepartment' },
    icon: 'mdi-camera-metering-matrix',
    auth: [Role.ROLE_ADMIN]
  },
  {
    text: '系统日志',
    to: { name: 'sysLog' },
    icon: 'mdi-compass mdi-spin',
    auth: [Role.ROLE_ADMIN]
  }, {
    name: '基础数据管理',
    children: [
      {
        text: '供应商管理',
        to: { name: 'supplier' },
        icon: 'mdi-home-assistant',
        auth: [ Role.ROLE_ADMIN ]
      },
      {
        text: '仓库组织管理',
        to: { name: 'inventory' },
        icon: 'mdi-hospital-building',
        auth: [ Role.ROLE_ADMIN ]
      },
      {
        text: '物料类别管理',
        to: { name: 'materialType' },
        icon: 'mdi-dip-switch',
        auth: [ Role.ROLE_ADMIN ]
      },
      {
        text: '物料管理',
        to: { name: 'material' },
        icon: 'mdi-dns',
        auth: [ Role.ROLE_ADMIN ]
      }
    ]
  }, {
    name: '物料需求计划',
    children: [
      {
        text: '需求计划创建',
        to: { name: 'materialPlanCreate' },
        icon: 'mdi-newspaper',
        auth: [
          Role.ROLE_PRODUCTION_PLANER,
          Role.ROLE_WAREHOUSE_PLANER,
          Role.ROLE_FINANCE_PLANER,
          Role.ROLE_WORKSHOP_PLANER
        ]
      },
      {
        text: '需求计划管理',
        to: { name: 'materialPlanManagement' },
        icon: 'mdi-nfc-variant',
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
      }
    ]
  }, {
    name: '采购计划',
    children: [
      {
        text: '物资供应方案',
        to: { name: 'summary' },
        icon: 'mdi-note-multiple',
        auth: [
          Role.ROLE_PROCUREMENT_PLANER
        ]
      },
      {
        text: '采购计划管理',
        to: { name: 'procurementPlanManagement' },
        icon: 'mdi-nutrition',
        auth: [
          Role.ROLE_PROCUREMENT_PLANER,
          Role.ROLE_PROCUREMENT_SUPERVISOR,
          Role.ROLE_FINANCE,
          Role.ROLE_FINANCE_PLANER,
          Role.ROLE_FINANCE_SUPERVISOR
        ]
      }
    ]
  }, {
    name: '采购订单',
    children: [
      {
        text: '采购订单创建',
        to: { name: 'procurementOrderCreate' },
        icon: 'mdi-file-document',
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
 * @returns {[]}
 */
export const genMenu = (menus = MENUS) => {
  if (menus === null) {
    return menus
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
