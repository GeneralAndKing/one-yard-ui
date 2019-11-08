import axios from './index'
import Vue from 'vue'
/**
 * 请一定写注释！格式和这个类似！
 * 获取所有资源
 *
 * @returns 响应
 */
export const getAllByPage = (resource, params) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/rest/${resource}`,
      method: 'get',
      params: params
    }).then(res => {
      resolve(res)
    }).catch(error => {
      // TODO:初始化失败提示
      console.log(error)
      reject(error)
    })
  })
}

/**
 * 获取所有资源
 *
 * @returns 响应
 */
export const getAll = (resource) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/rest/${resource}/search/all`,
      method: 'get'
    }).then(res => {
      resolve(res)
    }).catch(error => {
      Vue.prototype.$message('初始化失败', 'error')
      console.log(error)
      reject(error)
    })
  })
}

/**
 * 删除指定链接
 *
 * @param resource self 链接
 * @returns 响应
 */
export const deleteByLink = (resource) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/rest/${resource}`,
      method: 'delete'
    }).then(res => {
      Vue.prototype.$message('删除数据成功', 'success')
      resolve(res)
    }).catch(error => {
      Vue.prototype.$message('删除数据失败', 'error')
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
      url: `/rest/${resource}`,
      method: 'post',
      data: data
    }).then(res => {
      Vue.prototype.$message('添加数据成功', 'success')
      resolve(res)
    }).catch(error => {
      Vue.prototype.$message('添加数据成功', 'error')
      console.log(error)
      reject(error)
    })
  })
}

/**
 * 更新一个资源
 *
 * @param resource 资源名称
 * @param id 资源 ID
 * @param data 更新数据
 * @returns {*} 请求结果
 */
export const putOne = (resource, id, data) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/rest/${resource}/${id}`,
      method: 'put',
      data: data
    }).then(res => {
      Vue.prototype.$message('更新数据成功', 'success')
      resolve(res)
    }).catch(error => {
      Vue.prototype.$message('更新数据失败', 'error')
      console.log(error)
      reject(error)
    })
  })
}
