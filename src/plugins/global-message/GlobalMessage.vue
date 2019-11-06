<template lang="pug">
    v-snackbar(v-model="snackbar", :bottom="y === 'bottom'", color="success", :left="x === 'left'"
    :multi-line="mode === 'multi-line'"
    :right="x === 'right'"
    :timeout="timeout"
    :top="y === 'top'"
    :vertical="mode === 'vertical'"
    ) {{content}}
</template>
<script>

export default {
  name: 'GlobalMessage',
  data () {
    return {
      type: 'purple',
      mode: 'multi-line',
      snackbar: false,
      content: 'Hello, I\'m a snackbar',
      timeout: 6000,
      x: 'right',
      y: 'top'
    }
  },
  mounted () {
    console.log(this.type)
  }
}
</script>
