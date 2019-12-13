<template lang="pug">
  .print-procurement-order
    table(border="1", cellspacing="0")
      thead
        th(colspan="11")
          h1.one-title {{info.name}}({{info.type}})
      tbody
        tr
          td.one-title(colspan="6", rowspan="2") 订货单位（甲方）：G&K责任有限公司
          td(colspan="3", width="33%") 框架合同编号：{{info.frameworkAgreementCode}}
          td(colspan="2") 订单编号：{{info.code}}
        tr
          td(colspan="3") 供货单位联系人：
          td(colspan="2", rowspan="2") 订单时间：{{info.createTime.replace('T', ' ')}}
        tr
          td.one-title(colspan="6", rowspan="2") 供货单位（乙方）：
          td(colspan="3") 施工单位联系电话：
        tr
          td(colspan="3") 施工单位联系人：
          td(colspan="2", rowspan="3") 需求到货日期：{{info.deliveryDate}}
        tr
          td(colspan="6") 工程部联系人及电话：
          td(colspan="3") 施工单位联系电话：
        tr
          td(colspan="6") 订单类型：{{info.type}}
          td(colspan="3") 采购部门：{{info.procurementDepartment}}
        tr
          td(colspan="11") 备注：{{info.remark}}
        tr.text-center
          td 序号
          td 物料名称
          td 物料代码
          td 采购单位
          td 采购数量
          td 计价单位
          td 计价数量
          td 供应商
          td 单价/元
          td 总价/元
          td 备注
        tr.text-center(v-for="(material, index) in procurementMaterial")
          td {{index + 1}}
          td {{material.material.name}}
          td {{material.material.code}}
          td {{material.procurementUnit}}
          td {{material.procurementNumber}}
          td {{material.chargeUnit}}
          td {{material.chargeNumber}}
          td {{material.supplier}}
          td {{material.unitPrice}}
          td {{material.totalPrice}}
          td {{material.remark}}
        tr.text-center
          td(colspan="4") 合计
          td {{sumProcurementNumber}}
          td -
          td {{sumChargeNumber}}
          td -
          td -
          td {{sumTotalPrice}}
          td -
        tr
          td.normal(colspan="12")
            div 订单条款：
              span(v-if="info.type === '框架协议订单'") 本订单遵循相应的框架协议约束的法律效应。
            div(v-for="(orderTerm, index) in orderTerms")
              | {{index + 1}}. {{orderTerm.name}}: {{orderTerm.detail}}
              p(v-if="orderTerm.description !== null && orderTerm.description !== ''") 说明：{{orderTerm.description}}
        tr.word
          td(colspan="3") 采购工程师：
          td(colspan="3") 采购主管审核：
          td(colspan="3") 甲方（盖章）：
          td(colspan="3") 乙方（盖章）：
</template>

<script>

export default {
  name: 'PrintProcurementOrder',
  props: {
    info: { type: Object, required: true }
  },
  data: () => ({
    procurementMaterial: [],
    orderTerms: [],
    sumProcurementNumber: 0,
    sumChargeNumber: 0,
    sumTotalPrice: 0
  }),
  created () {
    this.procurementMaterial = this.info.procurementMaterial
    this.orderTerms = this.info.orderTerms
    this.procurementMaterial.some(value => {
      this.sumProcurementNumber += value.procurementNumber
      this.sumChargeNumber += value.chargeNumber
      this.sumTotalPrice += value.totalPrice
    })
  }
}
</script>

<style scoped lang="stylus">
*
  color black
  line-height 2.5
table
  border-collapse collapse
  margin-left 20px
  margin-right  20px
  width calc(100% - 40px)
  td
    padding-left 10px
.text-center
  text-align center
  td
    padding-left 0
.normal
  line-height 1
.word
  td
    padding-bottom 70px
</style>
