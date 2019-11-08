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
      console.log(error)
      reject(error)
    })
  })
}
