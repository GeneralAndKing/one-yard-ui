import axios from './index'
/**
 * 上传头像
 *
 * @returns 响应
 */
export const uploadAvatar = (avatar, username) => {
  let formData = new FormData()
  formData.append('file', avatar)
  formData.append('user', username)
  return axios.request({
    url: `/files/avatar`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: formData
  })
}

/**
 * 上传头像
 *
 * @returns 响应
 */
export const uploadAvatarMe = (avatar) => {
  let formData = new FormData()
  formData.append('file', avatar)
  return axios.request({
    url: `/files/avatar/self`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: formData
  })
}
