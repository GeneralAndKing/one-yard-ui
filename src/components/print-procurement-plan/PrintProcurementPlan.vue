<template lang="pug">
  v-container
    h1.text-center.mt-12.one-title {{procurementPlan.name}}
    .code.mt-5.text-right 需求计划类型：{{procurementPlan.planType}}
    v-data-table.mt-5(:headers="headers", :items="desserts", disable-pagination, no-data-text="暂无数据",
      disable-sort, hide-default-footer)
</template>

<script>

export default {
  name: 'PrintProcurementPlan',
  props: {
    procurementPlan: Object,
    desserts: Array
  },
  data: () => ({
    headers: [
      { text: '行号', value: 'id', align: 'start', width: '20px' },
      { text: '物料编码', value: 'materialCode', align: 'start' },
      { text: '物料名称', value: 'materialName', align: 'start' },
      { text: '物料分类编码', value: 'materialTypeCode', align: 'start' },
      { text: '物料分类名称', value: 'materialTypeName', align: 'start' },
      { text: '规格', value: 'materialSpecifications', align: 'start' },
      { text: '型号', value: 'materialSize', align: 'start', width: '20px' },
      { text: '计量单位', value: 'materialUnit', align: 'start' },
      { text: '需求日期', value: 'date', align: 'start' },
      { text: '采购方式', value: 'supplyMode', align: 'start' },
      { text: '采购数量', value: 'supplyNumber', align: 'start' },
      { text: '采购日期', value: 'purchaseDate', align: 'start' },
      { text: '计划来源', value: 'planSource', align: 'start' }
    ]
  }),
  created () {
    let id = 1
    this.desserts.forEach(d => {
      d.id = id
      id += 1
    })
  }
}
</script>
<style scoped lang="stylus">
  .full-width
    width 100%
  .code
    text-align right
    font-weight 300
  .text-center
    text-align center
  .text-right
    text-align right
  .text-left
    text-align left
  .mt-12
    margin-top 36px
  .mt-5
    margin-top 10px
  .one-title
    font-size 36px
  .one-flex
    display flex
  .one-flex-space-between
    justify-content space-between
</style>
