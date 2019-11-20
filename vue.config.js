const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  'transpileDependencies': [
    'vuetify'
  ],
  configureWebpack: {
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: false,
              drop_console: true, // console
              drop_debugger: false,
              pure_funcs: ['console.log']// 移除console
            }
          }
        })
      ]
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src/'))
      .set('_a', resolve('src/assets'))
      .set('_c', resolve('src/components'))
      .set('_v', resolve('src/views'))
      .set('_u', resolve('src/utils'))
      .set('_api', resolve('src/api'))
      .set('_lib', resolve('src/lib'))
      .set('_store', resolve('src/store'))
      .set('_plugins', resolve('src/plugins'))
      .set('_router', resolve('src/router'))
  },

  productionSourceMap: false,

  // 跨域配置
  devServer: {
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://localhost:8080/api',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    disableHostCheck: true
  }
}
