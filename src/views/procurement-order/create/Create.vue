<template lang="pug">
  #one-order-create
    v-container
      procurement-order

</template>

<script>
import ProcurementOrder from '_c/procurement-order'
export default {
  name: 'Create',
  components: {
    ProcurementOrder
  },
  data: () => ({
    //
  })
}
</script>

<style scoped lang="stylus">

</style>
