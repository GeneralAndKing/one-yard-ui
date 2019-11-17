<template lang="pug">
  v-container.one-print
    v-card
      v-card-title
        v-alert(type="info", dense, outlined, width="100%") 建议使用
          strong 横向
          | 打印哦～
          v-btn(outlined, @click="()=>{this.$router.back()}", color="warning",
            style="position: absolute; right: 100px;") 返回
          v-btn.mr-3(outlined, @click="()=>{this.$print(this.$refs.print)}", color="success",
            style="position: absolute; right: 0;") 打印
      v-card-text(ref="print")
        print-material-plan(:materialPlan="model", v-if="flag==='materialPlan'")
        print-procurement-plan(:procurementPlan="model", :desserts="desserts", v-else-if="flag==='procurementPlan'")
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
  }
}
</script>

<style scoped lang="stylus">

</style>
