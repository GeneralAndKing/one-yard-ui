import Vue from 'vue'
import axios from 'axios'
import { baseURL } from '_api/config'

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    console.log(this.baseUrl)
    // 请求队列
    this.queue = {}
  }
  /**
   * 请求的全局配置
   *
   * @returns {{headers: {}, baseURL: *}}
   */
  getGlobalConfig () {
    return {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
  }

  /**
   * 队列销毁
   *
   * @param url
   */
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // iView.Spin.hide()
    }
  }

  /**
   * 拦截器
   *
   * @param instance 实例
   * @param url
   */
  interceptors (instance, url) {
    // 请求拦截器
    instance.interceptors.request.use(config => {
      if (Object.keys(this.queue).length) {
        // iView.Spin.show()
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截器
    instance.interceptors.response.use(res => {
      this.destroy(url)
      return res
    }, error => {
      this.destroy(url)
      if (error.response.status === 400 && error.data !== undefined && error.data.hasOwnProperty('error_description')) {
        Vue.prototype.$message(`请求错误:${error.data.error_description}`, 'error')
      }
      if (error.response.status === 401) {
        Vue.prototype.$message('未经授权:访问由于凭据无效被拒绝', 'error')
      }
      if (error.response.status === 403) {
        Vue.prototype.$message('鉴权失败:您没有权限访问该资源', 'error')
      }
      if (error.response.status === 404) {
        Vue.prototype.$message('资源未找到:找不到您访问的资源信息', 'error')
      }
      if (error.response.status === 500) {
        Vue.prototype.$message('服务错误:服务器出现内部错误，请联系管理员', 'error')
      }
      return Promise.reject(error.response)
    })
  }

  /**
   * 创建请求实例
   *
   * @param options 请求参数
   * @returns {*} 结果
   */
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getGlobalConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

export default HttpRequest
