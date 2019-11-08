import auth from './modules/auth'
import admin from './modules/admin'
// import admin from './modules/admin'
export const routeMap = {
  ROLE_ADMIN: admin, // 管理员
  ROLE_PUBLIC: null, // 公共
  ROLE_ACCESS: null, // 游客
  ROLE_PLANER: null, // 需求计划员
  ROLE_PRODUCTION_PLANER: null, // 生产部门提报员
  ROLE_PRODUCTION_SUPERVISOR: null, // 生产部门主管
  ROLE_WORKSHOP_PLANER: null, // 车间部门提报员
  ROLE_WORKSHOP_SUPERVISOR: null, // 车间部门主管
  ROLE_WAREHOUSE_PLANER: null, // 仓库部门提报员
  ROLE_WAREHOUSE_SUPERVISOR: null// 仓库部门主管
}
export const whiteRoutes = [
  auth
]
