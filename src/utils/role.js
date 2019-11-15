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
    Object.keys(Role).forEach((key) => {
      if (Role[key] !== Role.ROLE_PUBLIC) {
        ROLE_ALL.push(Role[key])
      }
    })
    return ROLE_ALL
  },
  isPlaner (role) {
    return role.includes(Role.ROLE_PRODUCTION_PLANER) ||
      role.includes(Role.ROLE_WORKSHOP_PLANER) ||
      role.includes(Role.ROLE_WAREHOUSE_PLANER) ||
      role.includes(Role.ROLE_FINANCE_PLANER)
  },
  isAdmin (role) {
    return role.includes(Role.ROLE_ADMIN)
  },
  isSupervisor (role) {
    return role.includes(Role.ROLE_PRODUCTION_SUPERVISOR) ||
      role.includes(Role.ROLE_WORKSHOP_SUPERVISOR) ||
      role.includes(Role.ROLE_WAREHOUSE_SUPERVISOR) ||
      role.includes(Role.ROLE_FINANCE_SUPERVISOR)
  },
  supervisorList (role) {
    let list = []
    role.forEach((value) => {
      switch (value) {
        case Role.ROLE_PRODUCTION_SUPERVISOR:
          list.push(Department.ROLE_PRODUCTION_SUPERVISOR)
          break
        case Role.ROLE_WORKSHOP_SUPERVISOR:
          list.push(Department.ROLE_WORKSHOP_SUPERVISOR)
          break
        case Role.ROLE_WAREHOUSE_SUPERVISOR:
          list.push(Department.ROLE_WAREHOUSE_SUPERVISOR)
          break
        case Role.ROLE_FINANCE_SUPERVISOR:
          list.push(Department.ROLE_WAREHOUSE_SUPERVISOR)
          break
      }
    })
    return list
  }

}
export const Department = {
  ROLE_ADMIN: 1, // 管理员
  ROLE_PUBLIC: 1, // 公共
  ROLE_ACCESS: 1, // 游客
  ROLE_PRODUCTION_PLANER: 3, // 生产部门提报员
  ROLE_PRODUCTION_SUPERVISOR: 3, // 生产部门主管
  ROLE_WORKSHOP_PLANER: 4, // 车间部门提报员
  ROLE_WORKSHOP_SUPERVISOR: 4, // 车间部门主管
  ROLE_WAREHOUSE_PLANER: 5, // 仓库部门提报员
  ROLE_WAREHOUSE_SUPERVISOR: 5, // 仓库部门主管
  ROLE_PROCUREMENT_PLANER: 6, // 采购部门计划员
  ROLE_PROCUREMENT_SUPERVISOR: 6, // 采购部门主管
  ROLE_FINANCE: 7, // 财务管理员
  ROLE_FINANCE_PLANER: 7, // 财务部门提报员
  ROLE_FINANCE_SUPERVISOR: 7 // 财务部门主管
}

/**
 * 检测是否有权限
 */
export const checkPermissions = (auth, role) => {
  return auth.filter(v => role.includes(v)).length > 0
}
