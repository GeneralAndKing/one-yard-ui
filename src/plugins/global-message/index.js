import Vue from 'vue'
import GlobalMessage from './GlobalMessage.vue'
let listener = { id: -1, pos: -1, message: 1000 }
let messageId = 2000
const MessageBox = Vue.extend(GlobalMessage)
GlobalMessage.install = function (options, type) {
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
  options.id = messageId += 1
  options.listener = listener
  let instance = new MessageBox({
    data: options,
    destroyed () {
      listener.id = instance.$data.id
      listener.pos = -instance.$data.pos
      listener.message += 1
    }
  }).$mount()
  listener.pos = instance.pos
  listener.id = instance.id
  listener.message += 1
  document.getElementById('inspire').appendChild(instance.$el)
  Vue.nextTick(() => {
    instance.snackbar = true
  })
}
export default GlobalMessage
