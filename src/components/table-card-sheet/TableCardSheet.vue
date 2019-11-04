<template lang="pug">
  v-sheet.auth-table-sheet.ml-5.pa-5(:color="color", :elevation="elevation", max-width="calc(100% - 32px)")
    .title.white--text.font-weight-light.mb-2 {{ title }}
    v-divider(dark)
    p.font-weight-thin.white--text.ma-0.category {{ description }}
</template>

<script>

export default {
  name: 'TableCardSheet',
  props: {
    color: {
      type: String,
      default: 'green'
    },
    elevation: {
      type: Number,
      default: 12
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    //
  })
}
</script>

<style scoped lang="stylus">
  @import "index.styl"
</style>
