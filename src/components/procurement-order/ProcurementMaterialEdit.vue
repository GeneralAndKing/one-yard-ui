<template lang="pug">
  .one-material-edit
    v-dialog(v-model="show", :max-width="maxWidth", persistent)
      v-card
        v-card-title(primary-title)
          .headline.lighten-2 {{ edit ? '编辑' : '添加' }}数据
          v-spacer
          v-btn(icon,  @click="handleClose", color="error")
            v-icon mdi-close
        v-card-text
          v-container(grid-list-md)
            v-form(:ref="formRef")
              v-layout(wrap, style="width:100%")
                v-flex(sm12, md6, lg4)
                  v-select(v-model="editItem.materialId", :items="materials", :ref="`${formRef}Material`",
                    label="物料", :rules="rules.unionRules(rules.requiredRules('物料'))", item-text="name", item-value="id" :disabled="editItem.planMaterialId!==undefined")
                v-flex(sm12, md6, lg4)
                  v-text-field(v-model="editItem.procurementUnit" :ref="`${formRef}procurementUnit`", label="采购单位" :disabled="editItem.planMaterialId!==undefined &&!change"
                    :rules="rules.unionRules(rules.requiredRules('采购单位'))")
                v-flex(sm12, md6, lg4)
                  v-text-field(v-model="editItem.procurementNumber" :ref="`${formRef}procurementNumber`", label="采购数量",
                    :rules="rules.unionRules(rules.requiredRules('采购数量'),rules.integerRules)", type="number" :disabled="editItem.planMaterialId!==undefined &&!change")
                v-flex(sm12, md6, lg4)
                  v-text-field(v-model="editItem.demandDepartment" :ref="`${formRef}demandDepartment`", label="需求部门"
                    :rules="rules.unionRules(rules.requiredRules('需求部门'))")
                v-flex(sm12, md6, lg4)
                  v-text-field(v-model="editItem.materialReceivingDepartment" :ref="`${formRef}materialReceivingDepartment`", label="收料部门"
                    :rules="rules.unionRules(rules.requiredRules('收料部门'))")
                v-flex(sm12, md6, lg4)
                  date-menu(v-model="editItem.deliveryDate", label="交货日期")
                v-flex(sm12, md6, lg4)
                  v-text-field(v-model="editItem.unitPrice" :ref="`${formRef}unitPrice`", label="单价",
                    :rules="rules.unionRules(rules.requiredRules('单价'))", suffix="元")
                v-flex(sm12, md6, lg4)
                  v-text-field(v-model="editItem.taxRate" :ref="`${formRef}taxRate`", label="税率",
                    :rules="rules.unionRules(rules.requiredRules('税率'),rules.integerRules,rules.maxLengthRules(3))", suffix="%" counter="number")
                v-flex(sm12, md6, lg4)
                  v-text-field(v-model="editItem.procurementUnit" :ref="`${formRef}chargeUnit`", label="计价单位" disabled)
                v-flex(sm12, md6, lg4)
                  v-text-field(v-model="editItem.procurementNumber" :ref="`${formRef}chargeNumber`", label="计价数量", type="number" disabled)
                v-flex(sm12, md6, lg4)
                  v-text-field(v-model="editItem.taxAmount" :ref="`${formRef}taxRate`", label="税额（总共交多少税）",
                    :rules="rules.unionRules(rules.requiredRules('税额'))", suffix="元" disabled)
                v-flex(sm12, md6, lg4)
                  v-text-field(v-model="editItem.taxableUnitPrice" :ref="`${formRef}taxableUnitPrice`", label="含税单价（包含税费的单价）",
                    :rules="rules.unionRules(rules.requiredRules('含税单价'))" disabled)
                v-flex(sm12, md6, lg4)
                  v-text-field(v-model="editItem.totalPrice" :ref="`${formRef}unitPrice`", label="总价（不含税）",
                    :rules="rules.unionRules(rules.requiredRules('总价'))", suffix="元" disabled)
                v-flex(sm12, md6, lg4)
                  v-text-field(v-model="editItem.taxTotalPrice" :ref="`${formRef}taxTotalPrice`", label="含税总价（税费+总价）",
                    :rules="rules.unionRules(rules.requiredRules('含税总价'))", suffix="元" disabled)
                v-flex(xs12, md6, md4)
                  v-switch(v-model="editItem.isComplimentary", :label="`是否是赠品:${editItem.isComplimentary ? '是': '否'}`")
        v-card-actions
          v-spacer
          v-btn(outlined, color="error", @click="handleReset") 重置
          v-btn(outlined, color="success", @click="handleSubmit") {{ edit ? '保存修改' : '添加' }}

</template>

<script>
import * as RuleAPI from '_u/rule'
import DateMenu from '_c/date-menu'

export default {
  name: 'ProcurementMaterialEdit',
  components: {
    DateMenu
  },
  props: {
    value: {
      type: Object,
      default: () => null
    },
    change: {
      type: Boolean,
      required: true
    },
    materials: {
      type: Array,
      required: true
    },
    maxWidth: {
      type: String,
      default: '1200px'
    }
  },
  data: () => ({
    show: false,
    defaultItem: {
      name: ``,
      materialId: null,
      procurementUnit: '',
      procurementNumber: 0,
      supplier: '',
      chargeUnit: '',
      chargeNumber: 0,
      deliveryDate: '',
      unitPrice: 0,
      taxableUnitPrice: 0.00,
      taxRate: 0,
      taxAmount: 0.00,
      totalPrice: 0.00,
      taxTotalPrice: 0.00,
      isComplimentary: false,
      demandDepartment: '',
      materialReceivingDepartment: '',
      status: '',
      sort: 1
    },
    editItem: {},
    edit: false,
    formRef: ''
  }),
  computed: {
    rules () {
      return RuleAPI
    },
    changeEditItem () {
      const { procurementNumber, unitPrice, taxRate } = this.editItem
      return {
        procurementNumber,
        unitPrice,
        taxRate
      }
    }
  },
  mounted () {
    this.initData()
  },
  watch: {
    value () {
      this.initData()
    },
    changeEditItem (value) {
      if (value.procurementNumber === '' || value.unitPrice === '' || value.taxRate === '') {
        return
      }
      let procurementNumber = parseFloat(value.procurementNumber)
      let unitPrice = parseFloat(value.unitPrice)
      let taxRate = parseFloat(value.taxRate)
      if (procurementNumber === 0.0 || unitPrice === 0.0 || taxRate === 0.0) {
        return
      }
      this.editItem.totalPrice = (procurementNumber * unitPrice).toFixed(2)
      this.editItem.taxAmount = (this.editItem.totalPrice * (0.01 * taxRate)).toFixed(2)
      this.editItem.taxTotalPrice = parseFloat(this.editItem.totalPrice) + parseFloat(this.editItem.taxAmount)
      this.editItem.taxableUnitPrice = (unitPrice * (1 + (0.01 * taxRate))).toFixed(2)
    }
  },
  methods: {
    initData () {
      this.edit = this.value !== null
      this.formRef = this.value !== null ? 'edit' : 'add'
      if (this.edit) this.editItem = this._.cloneDeep(this.value)
      else this.editItem = this._.cloneDeep(this.defaultItem)
      if (typeof (this.$refs[this.formRef]) !== 'undefined') this.$refs[this.formRef].resetValidation()
    },
    handleClose () {
      this.show = false
      this.$refs[this.formRef].resetValidation()
    },
    handleReset () {
      this.initData()
      this.$refs[this.formRef].resetValidation()
    },
    handleSubmit () {
      if (!this.$refs[this.formRef].validate(true)) return
      this.$emit('submit', this.editItem)
      this.handleClose()
    },
    handleShow () {
      this.show = true
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
