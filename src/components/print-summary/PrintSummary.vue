<template lang="pug">
  v-container
    h1.text-center.mt-12.one-title {{`${info}汇总表`}}
    v-data-table.mt-5(:headers="headers", :items="desserts", disable-pagination, no-data-text="暂无数据",
      disable-sort, hide-default-footer)
      template(v-slot:item.materialCode="{ item }")
        span {{item.material.code}}
      template(v-slot:item.materialName="{ item }")
        span {{item.material.name}}
      template(v-slot:item.materialTypeCode="{ item }")
        span {{item.materialType.code}}
      template(v-slot:item.materialTypeName="{ item }")
        span {{item.materialType.name}}
      template(v-slot:item.isSourceGoods="{ item }")
        span {{item.isSourceGoods?'是':'否'}}
</template>

<script>

export default {
  name: 'PrintSummary',
  props: {
    info: String,
    desserts: Array
  },
  data: () => ({
    headers: [
      { text: '行号', value: 'id', align: 'start', width: '20px' },
      { text: '物料编码', value: 'materialCode', align: 'start' },
      { text: '物料名称', value: 'materialName', align: 'start' },
      { text: '物料分类编码', value: 'materialTypeCode', align: 'start' },
      { text: '物料分类名称', value: 'materialTypeName', align: 'start' },
      { text: '需求部门', value: 'departmentName', align: 'start' },
      { text: '需求数量', value: 'number', align: 'start' },
      { text: '需求日期', value: 'date', align: 'start' },
      { text: '货源是否确定', value: 'isSourceGoods', align: 'start' },
      { text: '期望供应商', value: 'expectationSupplier', align: 'start' },
      { text: '固定供应商', value: 'fixedSupplier', align: 'start' }
    ]
  }),
  created () {
    if (this._.endsWith(this.info, '00')) {
      this.info = this.info.replace('00', ' 年度')
    } else {
      this.info = this.info + ' 月度'
    }
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
