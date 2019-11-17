<template lang="pug">
  v-container.one-print
    v-card
      v-card-title
        v-alert(type="info", dense, outlined, width="100%") 建议使用
          strong.error--text &nbsp;横向&nbsp;
          | 打印哦～字段过多建议
          strong.warning--text &nbsp;缩放&nbsp;
          | 打印哦～
          v-btn(outlined, @click="()=>{this.$router.back()}", color="warning",
            style="position: absolute; right: 100px;") 返回
          v-btn.mr-3(outlined, @click="()=>{this.$print(this.$refs.print)}", color="success",
            style="position: absolute; right: 0;") 打印
      v-card-text(ref="print")
        print-material-plan(:materialPlan="model", v-if="flag==='materialPlan'")
        print-procurement-plan(:procurementPlan="model", :desserts="desserts", v-if="flag==='procurementPlan'")
        print-summary(:info="model", :desserts="desserts", v-if="flag==='summary'")
</template>

<script>
import PrintMaterialPlan from '_c/print-material-plan'
import PrintProcurementPlan from '_c/print-procurement-plan'
import PrintSummary from '_c/print-summary/PrintSummary'
export default {
  name: 'Print',
  components: {
    PrintMaterialPlan,
    PrintProcurementPlan,
    PrintSummary
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
