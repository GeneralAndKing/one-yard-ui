<template lang="pug">
  v-snackbar(v-model="snackbar"
    absolute=false,
    :bottom="y === 'bottom'"
    :color="type"
    :left="x === 'left'"
    :multi-line="mode === 'multi-line'"
    :right="x === 'right'"
    :timeout="timeout"
    :top="y === 'top'"
    :vertical="mode === 'vertical'"
    :style="styles"
    ) {{content}}
      v-btn(text
      @click="snackbar = false"
      ) 关闭
</template>
<script>

export default {
  name: 'GlobalMessage',
  data () {
    return {
      type: 'info',
      mode: 'multi-line',
      snackbar: false,
      content: 'Hello, I\'m a snackbar',
      timeout: 3000,
      x: 'right',
      y: 'top',
      listener: null,
      id: -1,
      pos: -1,
      styles: null
    }
  },
  /**
   * x==right  x==right  x!==
   *  左           右     中
   * y=top     y!==top
   *  上          下
   */

  computed: {
  },
  created () {
    let left = this.x === 'left'
    let right = this.x === 'right'
    let center = !(left || right)
    let top = this.y === 'top'
    this.pos = top ? 1 : 4
    if (left) {} else if (right) { this.pos += 1 } else if (center) { this.pos += 2 }
    if (this.pos <= 3) {
      this.styles = 'top:8px'
    } else {
      this.styles = 'bottom:8px'
    }
  },
  watch: {
    snackbar: function (val) {
      if (val === false) {
        this.$nextTick(() => {
          this.$destroy()
        })
      }
    },
    'listener.message': function () {
      console.log(this.listener.message)
      if (Math.abs(this.listener.pos) === this.pos) {
        if (this.listener.pos > 0) {
          if (this.listener.id > this.id) {
            this.styles = this.pxAdd(this.styles)
          }
        } else {
          if (this.listener.id > this.id) {
            this.styles = this.pxSub(this.styles)
          }
        }
      }
    }
  },
  methods: {
    pxAdd (val) {
      let split = val.split(':')
      return `${split[0] + ':' + (parseInt(split[1]) + 88)}px`
    },
    pxSub (val) {
      let split = val.split(':')
      return `${split[0] + ':' + (parseInt(split[1]) - 88)}px`
    }
  }
}
</script>
