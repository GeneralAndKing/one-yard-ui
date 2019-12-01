<template lang="pug">
  v-row.global-confirm(v-if="show")
    v-dialog(v-model="dialog", :max-width="width", persistent)
      v-card
        v-card-title(:class="titleClass") {{title}}
        v-card-text(:class="contentClass") {{content}}
        v-card-actions
          v-spacer
          v-btn(:color="cancelClass", outlined, @click="cancel") {{cancelText}}
          v-btn(:color="okClass", outlined, @click="success") {{okText}}
</template>

<script>
import Vuetify from '_plugins/vuetify'

export default {
  name: 'GlobalConfirm',
  data: () => ({ }),
  created () {
    this.$vuetify = Vuetify.framework
  },
  methods: {
    cancel () {
      this.dialog = false
      setTimeout(() => { this.show = false }, 1000)
    },
    success () {
      this.ok()
      this.cancel()
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
