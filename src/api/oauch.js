import axios from './index'
const OAUTH_TOKEN = '/oauth/token'
const CHECK_TOKEN = '/oauth/check_token'
const authorization = 'Basic bGVzc29uLWNsb3VkOmxlc3Nvbi1jbG91ZC1zZWNyZXQ='
const OAUTH_ME = '/oauth/me'

// 暂时不对 token 进行校验

export const oauthToken = ({ username, password }) => {
  return axios.request({
    url: OAUTH_TOKEN,
    method: 'post',
    headers: {
      Authorization: authorization
    },
    data: {
      username: username,
      password: password,
      grant_type: 'password',
      scope: 'all'
    }
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
