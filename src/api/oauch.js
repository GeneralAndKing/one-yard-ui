import axios from './index'
import qs from 'qs'
const OAUTH_TOKEN = '/oauth/token'
const CHECK_TOKEN = '/oauth/check_token'
const authorizationBasic = 'Basic Z2FrOjEyMzQ1Ng=='
const authorization = 'Bearer '
const OAUTH_ME = '/oauth/me'
const AUTH_REGISTER = '/auth/register'
const AUTH_FORGET = '/auth/forget'
// 暂时不对 token 进行校验

/**
 * 请求token
 *
 * @param username 用户对象用户名
 * @param password 用户对象密码
 * @returns {*} 他哦肯
 */
export const oauthToken = ({ username, password }) => {
  return axios.request({
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
}

/**
 * 检验 token
 *
 * @param token
 * @returns {*}
 */
export const checkToken = (token) => {
  return axios.request({
    url: CHECK_TOKEN,
    method: 'post',
    headers: {
      Authorization: authorizationBasic
    },
    data: {
      token: token
    }
  })
}

/**
 * 当前用户的信息
 *
 * @param token
 * @returns {*}
 */
export const oauthMe = (token) => {
  return axios.request({
    url: OAUTH_ME,
    method: 'get',
    headers: {
      Authorization: authorization + token
    }
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
  return axios.request({
    url: AUTH_REGISTER,
    method: 'post',
    data: { username, email, phone, password, rePassword, code }
  })
}

/**
 * 注册邮件
 *
 * @param email
 * @returns {*}
 */
export const authRegisterEmail = ({ email }) => {
  return axios.request({
    url: `${AUTH_REGISTER}/${email}`,
    method: 'get'
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
  return axios.request({
    url: AUTH_FORGET,
    method: 'post',
    data: { email, password, rePassword, code }
  })
}

/**
 * 忘记密码邮件
 *
 * @param email
 * @returns {*}
 */
export const authForgetEmail = ({ email }) => {
  return axios.request({
    url: `${AUTH_FORGET}/${email}`,
    method: 'get'
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
  return axios.request({
    url: `${AUTH_FORGET}/${email}/${code}`,
    method: 'get'
  })
}

/**
 * 检验邮箱是否存在
 *
 * @param email
 * @returns {*}
 */
export const authExistEmail = ({ email }) => {
  return axios.request({
    url: '/rest/sysUser/search/existsByEmail',
    method: 'get',
    params: {
      email: email
    }
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
  return axios.request({
    url: `/rest/sysUser/search/existsBy${action.replace(/^\S/, s => s.toUpperCase())}`,
    method: 'get',
    params: { username, email, phone }
  })
}
