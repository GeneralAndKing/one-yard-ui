<template lang="pug">
  v-card.rigth
    v-sheet.auth-card-icon.ml-5.text-center(:color="iconColor", :elevation="elevation", :width="width", :height="height")
      v-icon.fill-height.fill-width.white--text(:size="iconSize") {{ icon }}
    v-card-text.pa-2
      p.grey--text.font-weight-light.ma-0.text-right {{ subTitle }}
      p.display-1.ma-0.text-right {{ main }}
      v-divider.my-2
      v-icon.mr-2.text-left(small) {{ actionIcon }}
      span.caption.grey--text.font-weight-light.text-left {{ action }}
</template>

<script>

export default {
  name: 'DataCard',
  props: {
    action: {
      type: String,
      default: ''
    },
    actionIcon: {
      type: String,
      required: true
    },
    main: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      required: true
    },
    iconSize: {
      type: Number,
      default: 48
    },
    iconColor: {
      type: String,
      required: true
    },
    elevation: {
      type: Number,
      default: 5
    },
    width: {
      type: Number,
      default: 92
    },
    height: {
      type: Number,
      default: 92
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
