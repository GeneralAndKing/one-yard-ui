<template lang="pug">
    div
        div(ref="print")
          print-material-plan(v-model='model' v-if="flag==='materialPlan'")
          print-procurement-plan(v-model='model' v-else-if="flag==='procurement'")
</template>

<script>
import PrintMaterialPlan from '_c/print-material-plan'
import PrintProcurementPlan from '_c/print-procurement-plan'
export default {
  name: 'Print',
  components: {
    PrintMaterialPlan,
    PrintProcurementPlan
  },
  data () {
    return {
      model: null,
      flag: null
    }
  },
  created () {
    this.model = this.$route.params.model
    this.flag = this.$route.params.flag
    if (this.model === undefined || this.flag === undefined) {
      this.$router.back()
    } else {
      this.$nextTick(() => [
        this.$print(this.$refs.print)
      ])
    }
  }

}
</script>

<style scoped lang="stylus">

</style>
