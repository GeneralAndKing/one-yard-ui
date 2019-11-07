import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Message from './plugins/global-message'
import _ from 'lodash'
Vue.prototype.$message = Message
Vue.config.productionTip = false
Vue.prototype._ = _

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
