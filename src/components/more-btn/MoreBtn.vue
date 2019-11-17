<template lang="pug">
  .one-more-btn
    v-speed-dial(v-model="fab", top, right, absolute, direction='bottom'
      transition='slide-y-reverse-transition')
      template(v-slot:activator)
        v-btn(v-model="fab", color="blue darken-2", fab, dark)
          v-icon(v-if="fab") mdi-close
          v-icon(v-else) mdi-gamepad
      slot
</template>

<script>

export default {
  name: 'MoreBtn',
  data: () => ({
    fab: false
  })
}
</script>

<style scoped lang="stylus">

</style>
