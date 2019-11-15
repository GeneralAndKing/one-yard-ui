<template>
  <div id="vcomments"></div>
</template>

<script>
export default {
  name: 'Valine',
  data: () => ({
    window: null
  }),
  mounted () {
    this.valine()
  },
  methods: {
    valine () {
      if (typeof (window) !== 'undefined') {
        this.window = window
        window.AV = require('leancloud-storage')
      }
      const Valine = require('valine');
      new Valine({
        el: '#vcomments' ,
        appId: '',
        appKey: '',
        notify: false,
        verify: false,
        avatar: 'identicon',
        placeholder: '发表我的看法～'
      })
    }
  }
}
</script>

