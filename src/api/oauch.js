import axios from './index'
import qs from 'qs'
const OAUTH_TOKEN = '/oauth/token'
const CHECK_TOKEN = '/oauth/check_token'
const authorization = 'Basic Z2FrOjEyMzQ1Ng=='
const OAUTH_ME = '/oauth/me'
const AUTH_REGISTER = '/auth/register'
const AUTH_FORGET = '/auth/forget'
// 暂时不对 token 进行校验

export const oauthToken = ({ username, password }) => {
  return axios.request({
    url: OAUTH_TOKEN,
    method: 'post',
    headers: {
      Authorization: authorization,
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
export const checkToken = (token) => {
  return axios.request({
    url: CHECK_TOKEN,
    method: 'post',
    headers: {
      Authorization: authorization
    },
    data: {
      token: token
    }
  })
}
export const oauthMe = (token) => {
  return axios.request({
    url: OAUTH_ME,
    method: 'get',
    headers: {
      Authorization: authorization
    }
  })
}
export const authRegister = ({ username, email, phone, password, rePassword, code }) => {
  return axios.request({
    url: AUTH_REGISTER,
    method: 'post',
    data: { username, email, phone, password, rePassword, code }
  })
}
export const authRegisterEmail = ({ email }) => {
  return axios.request({
    url: `${AUTH_REGISTER}/${email}`,
    method: 'get'
  })
}
export const authForget = ({ email, password, rePassword, code }) => {
  return axios.request({
    url: AUTH_FORGET,
    method: 'post',
    data: {
      email: email,
      password: password,
      rePassword: rePassword,
      code: code
    }
  })
}

export const authForgetEmail = ({ email }) => {
  return axios.request({
    url: `${AUTH_FORGET}/${email}`,
    method: 'get'
  })
}

export const authExistEmail = ({ email }) => {
  return axios.request({
    url: '/rest/sysUser/search/existsByEmail',
    method: 'get',
    params: {
      email: email
    }
  })
}

export const authExist = ({ username, email, phone, action }) => {
  return axios.request({
    url: `/rest/sysUser/search/existsBy${action.replace(/^\S/, s => s.toUpperCase())}`,
    method: 'get',
    params: { username, email, phone }
  })
}
