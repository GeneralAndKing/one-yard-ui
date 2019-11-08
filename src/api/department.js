import axios from './index'
import Message from '_plugins/global-message'

/**
 * 根据部门id获取所属角色
 *
 * @returns 响应
 */
export const getRoleByDepartment = (id) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/rest/sysRole/search/byDepartment`,
      method: 'get',
      params: { id }
    }).then(res => {
      resolve(res)
    }).catch(error => {
      Message('获取角色失败', 'error')
      reject(error)
    })
  })
}

/**
 * 根据角色id获取所属权限
 *
 * @returns 响应
 */
export const getPermissionByRole = (id) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/rest/sysPermission/search/byRole`,
      method: 'get',
      params: { id }
    }).then(res => {
      resolve(res)
    }).catch(error => {
      Message('获取权限失败', 'error')
      reject(error)
    })
  })
}

/**
 * 根据角色id获取用户列表
 *
 * @returns 响应
 */
export const getUserByRole = (id) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/rest/sysUser/search/byRole`,
      method: 'get',
      params: { id }
    }).then(res => {
      resolve(res)
    }).catch(error => {
      Message('获取用户失败', 'error')
      reject(error)
    })
  })
}
