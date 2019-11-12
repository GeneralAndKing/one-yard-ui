import Vue from 'vue'
import App from './App.vue'
import router from '_router'
import store from '_store'
import vuetify from '_plugins/vuetify'
import Message from '_plugins/global-message'
import _ from 'lodash'
Vue.prototype.$message = Message.install
Vue.config.productionTip = false
Vue.prototype._ = _

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
