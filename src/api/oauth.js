
import axios from 'axios'
import authAxios from './index'
import qs from 'qs'
import { baseURL } from './config'
const OAUTH_TOKEN = baseURL + 'oauth/token'
const CHECK_TOKEN = baseURL + 'oauth/check_token'
const authorizationBasic = 'Basic Z2FrOjEyMzQ1Ng=='
const AUTH_REGISTER = baseURL + 'auth/register'
const AUTH_FORGET = baseURL + 'auth/forget'
// 暂时不对 token 进行校验

/**
 * 请求token
 *
 * @param username 用户对象用户名
 * @param password 用户对象密码
 * @returns {*} 他哦肯
 */
export const oauthToken = ({ username, password }) => {
  return axios({
    url: OAUTH_TOKEN,
    method: 'post',
    headers: {
      Authorization: authorizationBasic,
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({
      username: username,
      password: password,
      grant_type: 'password',
      scope: 'all'
    })
  })
    .then(res => {
      return Promise.resolve(res)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/**
 * 检验 token
 *
 * @param token
 * @returns {*}
 */
export const checkToken = (token) => {
  return axios({
    url: CHECK_TOKEN,
    method: 'post',
    headers: {
      Authorization: authorizationBasic,
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({
      token: token
    })
  })
    .then(res => {
      return Promise.resolve(res)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}
/**
 * 刷新token
 * @param refreshToken
 * @returns {Promise<AxiosResponse<any>>}
 */
export const refreshToken = (refreshToken) => {
  return axios({
    url: OAUTH_TOKEN,
    method: 'post',
    headers: {
      Authorization: authorizationBasic,
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  })
    .then(res => {
      return Promise.resolve(res)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}
/**
 * 注册请求
 *
 * @param username
 * @param email
 * @param phone
 * @param password
 * @param rePassword
 * @param code
 * @returns {*}
 */
export const authRegister = ({ username, email, phone, password, rePassword, code }) => {
  return axios({
    url: AUTH_REGISTER,
    method: 'post',
    data: { username, email, phone, password, rePassword, code }
  })
    .then(res => {
      return Promise.resolve(res)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/**
 * 注册邮件
 *
 * @param email
 * @returns {*}
 */
export const authRegisterEmail = ({ email }) => {
  return axios({
    url: `${AUTH_REGISTER}/${email}`,
    method: 'get'
  })
    .then(res => {
      return Promise.resolve(res)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/**
 * 忘记密码请求
 *
 * @param email
 * @param password
 * @param rePassword
 * @param code
 * @returns {*}
 */
export const authForget = ({ email, password, rePassword, code }) => {
  return axios({
    url: AUTH_FORGET,
    method: 'post',
    data: { email, password, rePassword, code }
  })
    .then(res => {
      return Promise.resolve(res)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/**
 * 忘记密码邮件
 *
 * @param email
 * @returns {*}
 */
export const authForgetEmail = ({ email }) => {
  return axios({
    url: `${AUTH_FORGET}/${email}`,
    method: 'get'
  })
    .then(res => {
      return Promise.resolve(res)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/**
 * 验证验证码
 *
 * @param email
 * @param code
 * @returns {*}
 */
export const authForgetValidate = ({ email, code }) => {
  return axios({
    url: `${AUTH_FORGET}/${email}/${code}`,
    method: 'get'
  })
    .then(res => {
      return Promise.resolve(res)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/**
 * 检验邮箱是否存在
 *
 * @param email
 * @returns {*}
 */
export const authExistEmail = ({ email }) => {
  return axios({
    url: baseURL + '/rest/sysUser/search/existsByEmail',
    method: 'get',
    params: {
      email: email
    }
  })
    .then(res => {
      return Promise.resolve(res)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/**
 * 检验邮箱、电话、用户名是否存在
 *
 * @param username
 * @param email
 * @param phone
 * @param action
 * @returns {*}
 */
export const authExist = ({ username, email, phone, action }) => {
  return axios({
    url: baseURL + `/rest/sysUser/search/existsBy${action.replace(/^\S/, s => s.toUpperCase())}`,
    method: 'get',
    params: { username, email, phone }
  })
    .then(res => {
      return Promise.resolve(res)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}
export const getMe = () => {
  return new Promise((resolve, reject) => {
    authAxios.request({
      url: '/sysUser/me',
      method: 'get',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}
