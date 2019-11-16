<template lang="pug">
  v-container.one-print
    v-card
      v-card-title
        v-spacer
        v-btn.mr-3(outlined, @click="()=>{this.$router.back()}", color="warning") 返回
        v-btn(outlined, @click="()=>{this.$print(this.$refs.print)}", color="success") 打印
      v-card-text(ref="print")
        print-material-plan(:materialPlan="model", v-if="flag==='materialPlan'")
        print-procurement-plan(v-else-if="flag==='procurementPlan'")
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
      flag: null,
      desserts: null
    }
  },
  created () {
    this.model = this.$route.params.model
    this.desserts = this.$route.params.desserts
    this.flag = this.$route.params.flag
    if (this.model === undefined || this.flag === undefined) {
      this.$router.back()
    } else {
      // this.$nextTick(() => [
      //   this.$print(this.$refs.print)
      // ])
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
