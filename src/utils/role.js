export const Role = {
  ROLE_ADMIN: 1, // 管理员
  ROLE_PUBLIC: 2, // 公共
  ROLE_ACCESS: 3, // 游客
  ROLE_PRODUCTION_PLANER: 4, // 生产部门提报员
  ROLE_PRODUCTION_SUPERVISOR: 5, // 生产部门主管
  ROLE_WORKSHOP_PLANER: 6, // 车间部门提报员
  ROLE_WORKSHOP_SUPERVISOR: 7, // 车间部门主管
  ROLE_WAREHOUSE_PLANER: 8, // 仓库部门提报员
  ROLE_WAREHOUSE_SUPERVISOR: 9, // 仓库部门主管
  ROLE_PROCUREMENT_PLANER: 10, // 采购部门计划员
  ROLE_PROCUREMENT_SUPERVISOR: 11, // 采购部门主管
  ROLE_FINANCE: 12, // 财务管理员
  ROLE_FINANCE_PLANER: 13, // 财务部门提报员
  ROLE_FINANCE_SUPERVISOR: 14, // 财务部门主管
  all () {
    let ROLE_ALL = []
    console.log('123')
    Object.keys(Role).forEach((key) => {
      if (Role[key] !== Role.ROLE_PUBLIC) {
        ROLE_ALL.push(Role[key])
      }
    })
    return ROLE_ALL
  }
}

/**
 * 检测是否有权限
 */
export const checkPermissions = (auth, role) => {
  return auth.filter(v => role.includes(v)).length > 0
}
