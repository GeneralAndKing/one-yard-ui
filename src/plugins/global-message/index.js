import Vue from 'vue'
import GlobalMessage from './GlobalMessage.vue'
const pxAdd = (x, y) => `${parseInt(x) + parseInt(y)}px`
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
  const MessageBox = Vue.extend(GlobalMessage)
  let name = 'v-snack'
  if (options.hasOwnProperty('x')) name = `${name} v-snack--${options.x}`
  else name = `${name} v-snack--right`
  if (options.hasOwnProperty('y')) name = `${name} v-snack--${options.y}`
  else name = `${name} v-snack--top`
  const snacks = document.getElementsByClassName(name)
  let offset = '8px'
  for (let i = 0; i < snacks.length; i++) {
    offset = pxAdd(window.getComputedStyle(snacks[i]).getPropertyValue('height'), offset)
    offset = pxAdd(offset, '16px')
  }
  options.styles = {
    [`${options.hasOwnProperty('y') ? options.y : 'top'}`]: offset
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
