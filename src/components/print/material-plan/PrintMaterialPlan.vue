<template lang="pug">
  v-container
    p.code 需求计划编码：{{materialPlan.id}}
    h1.text-center.mt-12.one-title {{materialPlan.name}}
    .mt-12.one-flex.one-flex-space-between
      span.one-col-5.full-width.text-right(style="padding-right: 36px") 需求部门：{{department.name}}
      span.one-col-5.full-width.text-left(style="padding-left: 36px") 需求计划类型：{{materialPlan.planType}}
    .code.mt-5.text-right 制单人：{{materialPlan.createUser}}
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
      template(v-slot:item.specifications="{ item }")
        span {{item.material.specifications}}
      template(v-slot:item.size="{ item }")
        span {{item.material.size}}
      template(v-slot:item.unit="{ item }")
        span {{item.material.unit}}
      template(v-slot:item.isSourceGoods="{ item }")
        span {{item.isSourceGoods?'是':'否'}}
</template>

<script>
import * as restAPI from '_api/rest'

export default {
  name: 'PrintMaterialPlan',
  props: {
    materialPlan: Object
  },
  data: () => ({
    desserts: [],
    department: {},
    headers: [
      { text: '行号', value: 'id', align: 'center' },
      { text: '物料编码', value: 'materialCode', align: 'center' },
      { text: '物料名称', value: 'materialName', align: 'center' },
      { text: '物料分类编码', value: 'materialTypeCode', align: 'center' },
      { text: '物料分类名称', value: 'materialTypeName', align: 'center' },
      { text: '规格', value: 'specifications', align: 'center' },
      { text: '型号', value: 'size', align: 'center' },
      { text: '计量单位', value: 'unit', align: 'center' },
      { text: '需求数量', value: 'number', align: 'center' },
      { text: '需求日期', value: 'date', align: 'center' },
      { text: '货源是否确定', value: 'isSourceGoods', align: 'center' },
      { text: '期望供应商', value: 'expectationSupplier', align: 'center' },
      { text: '固定供应商', value: 'fixedSupplier', align: 'center' },
      { text: '需求库存组织', value: 'inventory', align: 'center' }
    ]
  }),
  created () {
    if (this.materialPlan.departmentId !== null) {
      restAPI.getOne('sysDepartment', this.materialPlan.departmentId)
        .then(res => {
          this.department = res.data
        })
    }
    this.desserts = this.materialPlan.materials
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
