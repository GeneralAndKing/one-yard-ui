<template lang="pug">
  v-row.global-confirm
    v-dialog(ref="dialog" ,v-model="dialog", :max-width="width", persistent)
      v-card
        v-card-title(:class="titleClass") {{title}}
        v-card-text(:class="contentClass") {{content}}
        v-card-actions
          v-spacer
          v-btn(:color="cancelClass", outlined, @click="dialog = false") {{cancelText}}
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
    success () {
      this.ok()
      this.dialog = false
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
