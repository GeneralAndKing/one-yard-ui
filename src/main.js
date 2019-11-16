import Vue from 'vue'
import App from './App.vue'
import router from '_router'
import store from '_store'
import vuetify from '_plugins/vuetify'
import Message from '_plugins/global-message'
import Print from '_plugins/print'
import '_plugins/permissions'
import _ from 'lodash'
Vue.use(Print) // 注册
Vue.prototype.$message = Message.install
Vue.config.productionTip = false
Vue.prototype._ = _

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
