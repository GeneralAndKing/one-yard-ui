import axios from './index'
import { getUrl } from '_utils/util'

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
      // iView.Message.error('数据初始化失败')
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
      iView.Message.success('数据删除成功！')
      resolve(res)
    }).catch(error => {
      iView.Message.error('数据删除失败！')
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
      iView.Message.success('数据添加成功！')
      resolve(res)
    }).catch(error => {
      iView.Message.error('数据添加失败！')
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
      iView.Message.success('数据更新成功！')
      resolve(res)
    }).catch(error => {
      iView.Message.error('数据更新失败！')
      console.log(error)
      reject(error)
    })
  })
}
