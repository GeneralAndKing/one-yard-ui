
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
 * 生成vue 标准路由
 * @param router
 * @returns {[]}
 */
export const genRouter = (router) => {
  let vueRouter = []
  if (!(router instanceof Array)) {
    router = [router]
  }
  router.forEach((item) => {
    if (!item.component && item.children) {
      vueRouter = vueRouter.concat(genRouter(item.children))
    } else {
      vueRouter.push({
        path: item.path,
        name: item.name,
        meta: item.meta,
        redirect: item.redirect,
        component: item.component,
        children: item.children ? genRouter(item.children) : null
      })
    }
  })
  return vueRouter

  // router.children.forEach((children) => {
  //   if (!children.component && children.children) {
  //     // vueRouter.push(vueChildren)
  //     genRouter(children).forEach((item) => {
  //       vueChildren.children = vueChildren.children.concat(item.children)
  //     })
  //   } else {
  //     vueChildren.children.push(children)
  //   }
  // })
  // if (vueChildren.children.length !== 0) {
  //   vueRouter.push(vueChildren)
  // }
  // return vueRouter
}
/**
 * 生成左侧菜单栏
 * @param router
 * @returns {{children: []}}
 */
export const genMenu = (router) => {
  if (router === null) {
    return null
  }
  console.log('menu')
  let menus = []
  if (!(router instanceof Array)) {
    router = [router]
  }
  router.forEach((item) => {
    if (!item.meta && item.name) {
      menus.push({
        name: item.name,
        children: genMenu(item.children)
      })
    } else {
      menus.push({
        icon: item.meta.icon,
        text: item.meta.meta,
        to: { name: item.name }
      })
    }
  })
  return menus
}
