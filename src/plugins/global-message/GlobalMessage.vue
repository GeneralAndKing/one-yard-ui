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
    ) {{content}}
        v-btn(
    text
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
      y: 'top'
    }
  }
}
</script>
