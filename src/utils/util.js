
/**
 * 比较当前时间与指定的时间戳
 *
 * @param time 指定时间戳
 * @returns {boolean} 是否过期，true 过期，false 未过期
 */
export const isExpired = (time) => {
  return Math.round(new Date() / 1000) - time > 0
}

/**
 * 简单的获取 url 后半部分，暂时用着
 *
 * @param link 链接
 * @returns {string} 结果
 */
export const getUrl = (link) => {
  return link.split('8080')[1]
}
/**
 * 避免使用过多的try catch
 * @param promise
 * @returns {Promise<T | [any]>}
 */
export const to = (promise) => {
  return promise.then(data => {
    return [null, data]
  })
    .catch(err => [err])
}

/**
 * 获取明天日期
 * @returns {string}
 */
export const tomorrow = () => {
  const tomorrow = new Date(new Date())
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString()
}

/**
 * 获取当前时间：YYYYMMDDhhmmss
 * @returns {string}
 */
export const getTime = () => {
  const date = new Date()
  const MM = date.getMonth() + 1
  const DD = date.getDate()
  const hh = date.getHours()
  const mm = date.getMinutes()
  const ss = date.getSeconds()
  return `${date.getFullYear()}${formatNumber(MM)}${formatNumber(DD)}${formatNumber(hh)}${formatNumber(mm)}${formatNumber(ss)}`
}

const formatNumber = (num) => {
  return `${num > 9 ? '' : '0'}${num}`
}
