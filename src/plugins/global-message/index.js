import Vue from 'vue'
import GlobalMessage from './GlobalMessage.vue'
const MessageBox = Vue.extend(GlobalMessage)

GlobalMessage.install = function (options, type) {
  console.log('123')
  if (options === undefined || options === null) {
    options = {
      content: ''
    }
  } else if (typeof options === 'string' || typeof options === 'number') {
    options = {
      content: options
    }
    if (type !== undefined) {
      options.type = type
    }
  }

  let instance = new MessageBox({
    data: options
  }).$mount()

  document.getElementById('inspire').appendChild(instance.$el)

  Vue.nextTick(() => {
    instance.snackbar = true
  })
}

export default GlobalMessage
