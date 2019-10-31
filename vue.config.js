const path = require('path')
const resolve = dir => path.join(__dirname, dir)

module.exports = {
  'transpileDependencies': [
    'vuetify'
  ],
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src/'))
      .set('_a', resolve('src/assets'))
      .set('_c', resolve('src/components'))
      .set('_v', resolve('src/views'))
  },

  productionSourceMap: false,

  // 跨域配置
  devServer: {
    // port: 8081,
    // proxy: {
    // '/api': {
    //   target: 'http://localhost:9000',
    //   changeOrigin: true,
    //   ws: true,
    //   pathRewrite: {
    //     '^/api': ''
    //   }
    // }
    // },
    disableHostCheck: true
  }
}
