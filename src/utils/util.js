
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
