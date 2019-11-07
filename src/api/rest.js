import axios from './index'
import { getUrl } from '_utils/util'
import Message from '_plugins/global-message'
/**
 * 请一定写注释！格式和这个类似！
 * 获取所有资源
 *
 * @returns 响应
 */
export const getAll = (resource) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/${resource}`,
      method: 'get'
    }).then(res => {
      resolve(res)
    }).catch(error => {
      Message('初始化失败', 'error')
      console.log(error)
      reject(error)
    })
  })
}

/**
 * 删除指定链接
 *
 * @param link self 链接
 * @returns 响应
 */
export const deleteByLink = (link) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: getUrl(link),
      method: 'delete'
    }).then(res => {
      Message('删除数据成功', 'success')
      resolve(res)
    }).catch(error => {
      Message('删除数据失败', 'error')
      console.log(error)
      reject(error)
    })
  })
}

/**
 * 添加一个资源
 *
 * @param resource 资源名称
 * @param data 添加的数据
 * @returns {*} 结果
 */
export const addOne = (resource, data) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/${resource}`,
      method: 'post',
      data: data
    }).then(res => {
      Message('添加数据成功', 'success')
      resolve(res)
    }).catch(error => {
      Message('添加数据成功', 'error')
      console.log(error)
      reject(error)
    })
  })
}

/**
 * 更新一个资源
 *
 * @param resource 资源名称
 * @param data 更新数据
 * @returns {*} 请求结果
 */
export const putOne = (resource, data) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/${resource}`,
      method: 'put',
      data: data
    }).then(res => {
      Message('更新数据成功', 'success')
      resolve(res)
    }).catch(error => {
      Message('更新数据失败', 'error')
      console.log(error)
      reject(error)
    })
  })
}
