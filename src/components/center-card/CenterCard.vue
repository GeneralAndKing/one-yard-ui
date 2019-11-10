<template lang="pug">
  v-app.one-center-card.white(light)
    v-content.fill-height
      v-row.fill-height.align-sm-center(justify="center")
        v-col.pa-0
          slot

</template>

<script>

export default {
  name: 'CenterCard',
  data: () => ({
    //
  })
}
</script>

<style scoped lang="stylus">
  .one-center-card
    overflow: hidden;
</style>
