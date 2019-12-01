import vue from 'vue'
import GlobalConfirm from './GlobalConfirm'
const ConfirmConstructor = vue.extend(GlobalConfirm)

const confirm = (option, ok = () => { console.log('ok') }) => {
  const defaultOption = {
    width: 290,
    titleClass: '',
    title: '您确定删除吗？',
    content: '',
    contentClass: '',
    cancelClass: 'error',
    cancelText: '取消',
    okClass: 'success',
    okText: '确认'
  }
  option = Object.assign(defaultOption, option)
  option.show = true
  option.dialog = true
  const confirmDom = new ConfirmConstructor({
    el: document.createElement('v-row'),
    data: option,
    methods: {
      ok
    }
  })
  document.body.appendChild(confirmDom.$el)
}

const registryConfirm = () => {
  vue.prototype.$confirm = confirm
}

export default registryConfirm
