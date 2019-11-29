<template lang="pug">
  div
    v-progress-linear(
      :active="options.active"
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
      :color="color"
      fixed
      style="z-index: 50")
</template>
<script>
import store from '_store'
export default {
  name: 'GlobalLoading',
  props: {
    options: {
      type: Object,
      default () {
        return {
          active: false,
          opacity: 1,
          bottom: false,
          buffer: 0,
          height: 5,
          indeterminate: true,
          query: false,
          rounded: true,
          stream: true,
          striped: true,
          top: false,
          value: 0
        }
      }
    }
  },
  data: () => ({
  }),
  computed: {
    color: function () {
      return store.getters['sundry/theme'] ? '#2196f3' : '#f44336'
    }
  }
}
</script>
