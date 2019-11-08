<template lang="pug">
    div
        v-progress-linear(          :active="options.active"
            :background-opacity="options.opacity"
            :bottom="options.bottom"
            :buffer-value="options.buffer"
            :height="options.height"
            :indeterminate="options.indeterminate"
            :query="options.query"
            :rounded="options.rounded"
            :stream="options.stream"
            :striped="options.striped"
            :top="options.top"
            :value="options.value"
            color="light-blue")
        br
</template>
<script>
export default {
  name: 'GlobalLoading',
  props: {
    options: {
      type: Object,
      default () {
        return {
          absolute: false,
          active: true,
          opacity: 0.3,
          bottom: false,
          buffer: 100,
          fixed: false,
          height: 4,
          indeterminate: false,
          query: false,
          rounded: false,
          stream: false,
          striped: false,
          top: false,
          value: 25
        }
      }
    }
  }
}
</script>
