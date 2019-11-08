import Vue from 'vue'
import GlobalLoading from './GlobalLoading.vue'
// TODO 未完成 日他妈的
GlobalLoading.install = null
GlobalLoading.config = function (options = {}) {
  Vue.component(GlobalLoading.name, GlobalLoading)
  const Component = Vue.extend(GlobalLoading)
  // 拿到自定义的属性
  const { autoFinish, ...res } = options
  // 创建组件实例
  const vm = new Component()
  // const vm = new Component({
  //   data: {
  //     autoFinish: typeof autoFinish === 'boolean' ? autoFinish : true
  //   }
  //
  // })
  // 将 progressBar 的默认 options 与 自定义的 options 合并
  options = Object.assign(vm.$props.options, { ...res })
  // 合并新的 props
  vm.$propsData = options
  vm.$mount()
  // 如果是服务端渲染那么不继续执行
  Vue.nextTick(() => {
    document.getElementById('inspire').appendChild(vm.$el)
  })
  GlobalLoading.install = {
    start () {
      if (Vue.$isServer) return
      console.log('123')
      vm.options.active = true
    },
    finish () {
      if (Vue.$isServer) return
      vm.active = false
    }
  }
}
export default GlobalLoading
