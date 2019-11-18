import Vue from 'vue'
import axios from 'axios'
import store from '_store'
import { baseURL } from '_api/config'
import router from '_router/index'

const refresh = async function () {
  try {
    await store.dispatch('auth/refreshToken')
    await store.dispatch('auth/checkToken')
    await store.dispatch('auth/getMe')
  } catch (e) {
    console.log(e)
  }
}

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
      console.log('123')
      // 如果有token 在header里加authorization
      if (store.getters['auth/isAuth']) {
        let token = store.getters['auth/token']
        // 如果token 快过期 刷新token
        if (store.getters['auth/isTokenExpired']) {
          refresh()
        }
        if (token.access_token) config.headers.Authorization = 'Bearer ' + token.access_token
      }

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
      let message = '未知错误'
      if (error !== null && error.response !== null) {
        switch (error.response.status) {
          case 400:
            message = '请求错误:访问由于请求体无效被拒绝'
            break
          case 401:
            message = '未经授权:访问由于凭据无效被拒绝'
            router.push({ name: 'login' })
            break
          case 403:
            message = '鉴权失败:您没有权限访问该资源'
            break
          case 404:
            message = '资源未找到:找不到您访问的资源信息'
            break
          case 500:
            message = '服务错误:服务器出现内部错误，请联系管理员'
            break
        }
        if (error.response.data !== undefined && (error.response.data.hasOwnProperty('error') || error.response.data.hasOwnProperty('error_description'))) {
          message = error.response.data.error + ': ' + error.response.data.error_description
        }
      }
      Vue.prototype.$message(message, 'error')
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
