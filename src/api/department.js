import axios from './index'

/**
 * 根据部门id获取所属角色
 *
 * @returns 响应
 */
export const getRoleByDepartment = (id) => {
  return axios.request({
    url: `/rest/sysRole/search/byDepartment`,
    method: 'get',
    params: { id }
  })
}

/**
 * 根据角色id获取所属权限
 *
 * @returns 响应
 */
export const getPermissionByRole = (id) => {
  return axios.request({
    url: `/rest/sysPermission/search/byRole`,
    method: 'get',
    params: { id }
  })
}

/**
 * 根据角色id获取用户列表
 *
 * @returns 响应
 */
export const getUserByRole = (id) => {
  return axios.request({
    url: `/rest/sysUser/search/byRole`,
    method: 'get',
    params: { id }
  })
}
