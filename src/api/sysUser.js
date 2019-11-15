import axios from './index'
/**
 * 上传头像
 *
 * @returns 响应
 */
export const uploadAvatar = (avatar) => {
  let formData = new FormData()
  formData.append('file', avatar)
  return axios.request({
    url: `/files/avatar`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: formData
  })
}
