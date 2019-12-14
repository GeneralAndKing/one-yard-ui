<template lang="pug">
  #one-order
    more-btn(v-if="see")
      v-btn(fab, small, color="green", dark, @click="print")
        v-icon mdi-printer-settings
    v-card
      v-slide-y-transition(mode="out-in")
        skeleton-loader(v-if="skeletonLoader")
        div(v-else)
          v-card-title 采购订单{{change?'变更':see? '编辑' : '添加'}}
          v-card-text
            v-container(grid-list-md)
              v-form(ref="base")
                v-layout(wrap, style="width:100%")
                  v-flex(sm12, md6, lg4)
                    v-text-field(v-model="order.name" ref="name", label="订单名称", :disabled='see||change', clearable,
                      :rules="rules.unionRules(rules.requiredRules('订单名称'))")
                  v-flex(sm12, md6, lg4)
                    v-select(v-model="order.type", :items="orderType", ref="orderType", :disabled='see||isSelect||change', @change="generateCode",
                      label="单据类型", :rules="rules.unionRules(rules.requiredRules('单据类型'))")
                  v-flex(sm12, md6, lg4)
                    v-select(v-model="order.supplier" :items="supplier", ref="supplier", :disabled='see||change', item-text="name", item-value="name",
                      label="供应商", :rules="rules.unionRules(rules.requiredRules('供应商'))")
                  v-flex(sm12, md6, lg4)
                    v-text-field(v-model="order.code" ref="code", label="单据编号", disabled, hint="此字段在选择单据类型后自动生成", persistent-hint,
                      :rules="rules.unionRules(rules.requiredRules('单据编号'))")
                  v-flex(sm12, md6, lg4, v-if="order.type === '框架协议订单'")
                    v-text-field(v-model="order.frameworkAgreementCode" ref="frameworkAgreementCode", label="框架协议编号",
                      hint="此字段在选择单据类型为框架协议订单时才可填写", persistent-hint, :rules="rules.unionRules(rules.requiredRules('框架协议编号'))")
                  v-flex(sm12, md6, lg4)
                    date-menu(v-model="order.procurementDate", label="采购日期" :disabled="see ||change")
                  v-flex(sm12, md6, lg4)
                    date-menu(v-model="order.deliveryDate", label="交货日期" :disabled="see ||change")
                  v-flex(sm12, md6, lg4)
                    v-text-field(v-model="order.procurementDepartment" ref="procurementDepartment", label="采购部门", :disabled='see||change', clearable,
                      :rules="rules.unionRules(rules.requiredRules('采购部门'))")
                  v-flex(sm12, md6, lg4)
                    v-text-field(v-model="order.remark" ref="remark", label="备注", :disabled='see||change', clearable,
                      :rules="rules.unionRules(rules.maxLengthRules(250))")
                  v-flex.text-right.mt-4(sm12, v-if="seeItem !== null")
                    v-btn.mr-4(outlined, color="secondary", @click="$refs.history.show = true", v-if="change") 变更历史
                    v-btn(outlined, color="secondary", @click="$refs.materials.show = true") 库存查询
            v-toolbar(flat, color="secondary")
            v-tabs(v-model="tab", show-arrows)
              v-tab(v-for="item in tabs", :key="item.id")
                v-icon(left) {{item.icon}}
                | {{item.name}}
              v-tabs-items.overflow-auto.mt-5(v-model="tab")
                v-tab-item(:key="1")
                  procurement-material(v-model="procurementMaterial", :see="see", :order="order", :loading="load.table",
                    @select="handleMaterialSelect" :materials="materials" :change="change")
                v-tab-item(:key="2")
                  order-terms(v-model="orderTerms", :see="see", :loading="load.table" :change="change")
                v-tab-item(:key="3")
                  v-layout(wrap, style="width:100%")
                    v-flex(sm12)
                      p.grey--text 以下内容系统自动生成
                    v-flex(sm12, md6)
                      v-text-field(v-model="order.createTime", label="创建时间", disabled)
                    v-flex(sm12, md6)
                      v-text-field(v-model="order.createUser", label="创建用户", disabled)
                    v-flex(sm12, md6)
                      v-text-field(v-model="order.modifyTime", label="修改时间", disabled)
                    v-flex(sm12, md6)
                      v-text-field(v-model="order.modifyUser", label="修改用户", disabled)
                v-tab-item(:key="4")
                  procurement-approve(:approve="procurementApprove")
            v-card-actions
              slot
              v-spacer
              v-btn(outlined, color="success", @click="handleSave", v-if="edit") {{see?'编辑':'保存'}}
    change-history(v-if="change", :item="seeItem", ref="history", :procurementMaterial="procurementMaterial")
    check-inventory(v-if="seeItem !== null", :material="materials", ref="materials")
</template>

<script>
import MoreBtn from '_c/more-btn'
import DateMenu from '_c/date-menu'
import ProcurementMaterial from './ProcurementMaterial'
import OrderTerms from './OrderTerms'
import ProcurementApprove from './ProcurementApprove'
import ChangeHistory from '_c/procurement-order/change-history'
import CheckInventory from '_c/procurement-order/check-inventory'
import SkeletonLoader from '_c/skeleton-loader'
import { orderTypeSelect, formatOrderTypeSelect } from '_u/status'
import { getTime, to } from '_u/util'
import * as RuleAPI from '_u/rule'
import * as RestAPI from '_api/rest'
import * as procurementOrderAPI from '_api/procurementOrder'
import { Role } from '_u/role'

export default {
  name: 'ProcurementOrder',
  components: {
    MoreBtn,
    DateMenu,
    ProcurementMaterial,
    OrderTerms,
    ProcurementApprove,
    ChangeHistory,
    CheckInventory,
    SkeletonLoader
  },
  props: {
    // 如果是编辑，那么 seeItem 不为 null
    seeItem: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    // 是否是查看
    tab: 0,
    tabs: [
      { id: 1, icon: 'mdi-account', name: '明细信息' },
      { id: 2, icon: 'mdi-account', name: '订单条款' },
      { id: 3, icon: 'mdi-account', name: '系统信息' },
      { id: 4, icon: 'mdi-account', name: '审批信息' }
    ],
    isSelect: false,
    see: false,
    skeletonLoader: true,
    change: false,
    orderType: orderTypeSelect,
    supplier: [],
    materials: [],
    order: {
      id: null,
      name: '',
      code: '',
      type: '',
      supplier: '',
      procurementDepartment: '',
      procurementDate: '',
      deliveryDate: '',
      planStatus: 'NO_SUBMIT',
      approvalStatus: 'NO_SUBMIT',
      createTime: '',
      createUser: '',
      modifyTime: '',
      modifyUser: '',
      remark: ''
    },
    procurementMaterial: [],
    orderTerms: [],
    procurementApprove: [],
    history: false,
    load: {
      table: false
    }
  }),
  computed: {
    rules () {
      return RuleAPI
    },
    edit () {
      const order = this.order
      return (order.approvalStatus === 'NO_SUBMIT' && order.planStatus === 'NO_SUBMIT') ||
        (order.approvalStatus === 'APPROVAL_NO' && order.planStatus === 'NO_SUBMIT') ||
        (order.approvalStatus === 'APPROVAL_OK' && order.planStatus === 'EFFECTIVE')
    },
    Role () {
      return Role
    }
  },
  watch: {
    'order.type' (val) {
      if (val !== '框架协议订单') this.order.frameworkAgreementCode = null
    }
  },
  async created () {
    let res = await RestAPI.getAll('supplier')
    this.supplier = res.data.content
    res = await RestAPI.getAll('material')
    this.materials = res.data.content
    try {
      // 编辑的时候，只能让他查看！
      if (!this.seeItem) return
      this.load.table = true
      this.see = true
      this.order = this.seeItem
      let res = await RestAPI.getRestLink(`orderTerms/search/byOrderId?orderId=${this.seeItem.id}`)
      this.orderTerms = res.data.content
      res = await RestAPI.getRestLink(`approval/search/byPlanIdAndApprovalType?approvalType=PROCUREMENT_ORDER_APPROVAL&planId=${this.seeItem.id}`)
      this.procurementApprove = res.data.content
      res = await RestAPI.getRestLink(`procurementMaterial/search/byOrderId?orderId=${this.seeItem.id}`)
      this.procurementMaterial = res.data.content
      this.change = this._.get(this.seeItem, 'isChange', false)
      if (this.change) this.see = false
      await this.procurementMaterial.some(value => {
        value.material = this._.find(this.materials, { id: value.materialId })
      })
    } finally {
      this.load.table = false
      this.skeletonLoader = false
    }
  },
  methods: {
    print () {
      this.order.procurementMaterial = this.procurementMaterial
      this.order.orderTerms = this.orderTerms
      this.$router.push({
        name: 'print',
        params: {
          model: this.order,
          flag: 'order',
          direction: true
        }
      })
    },
    generateCode () {
      const type = formatOrderTypeSelect(this.order.type)
      this.order.code = `${type}${getTime()}${Math.floor(Math.random() * (9999 - 100000) + 100000)}`
    },
    handleSave () {
      if (this.see) {
        this.see = false
      } else {
        if (this.change) {
          procurementOrderAPI.changeProcurementOrder(this.order.id, this.procurementMaterial).then(() => {
            this.$message('变更成功', 'success')
            this.$emit('back')
          })
          return
        }
        if (!this.$refs.base.validate(true)) {
          this.$message('请填写完订单属性后再进行保存', 'error')
          return
        }
        if (this.procurementMaterial.length === 0) {
          this.$message('物料为空不能保存订单', 'error')
          return
        }
        for (let value of this.procurementMaterial) {
          if (
            value.deliveryDate === '' ||
              value.unitPrice === '' ||
              value.taxableUnitPrice === '' ||
              value.taxRate === '' ||
              value.taxAmount === '' ||
              value.totalPrice === '' ||
              value.taxTotalPrice === '' ||
              value.demandDepartment === '' ||
              value.materialReceivingDepartment === '') {
            this.$message('请填写完整物料信息后再进行保存', 'error')
            return
          }
        }
        procurementOrderAPI.submit(this.order, this.procurementMaterial, this.orderTerms).then(res => {
          this.$message(res.data, 'success')
          this.see = true
          this.$router.push({ name: 'procurementOrderManagement' })
        })
      }
    },
    async handleMaterialSelect (items) {
      let res, err, departmentName
      this.procurementMaterial = this.procurementMaterial.filter(value => {
        if (value.planMaterialId === undefined) {
          return value
        }
      })
      if (items.length > 0) {
        this.isSelect = true
        for (let item of items) {
          if (this._.find(this.procurementMaterial, { id: item.id })) {
            continue
          }
          departmentName = item.remark
          if (item.planId !== null) {
            [err, res] = await to(RestAPI.getRestLink(`sysDepartment/search/getDepartmentName?planId=${item.planId}`))
            if (err === null) {
              departmentName = res.data
            }
          }

          this.procurementMaterial.push({
            planMaterialId: item.id,
            name: `${new Date().toISOString()}-${item.materialId}-${Math.ceil(Math.random() * 100)}`,
            materialId: item.materialId,
            procurementUnit: item.unit,
            procurementNumber: item.number,
            chargeUnit: '',
            chargeNumber: '',
            deliveryDate: '',
            unitPrice: '',
            taxableUnitPrice: '',
            taxRate: '',
            taxAmount: '',
            totalPrice: '',
            taxTotalPrice: '',
            isComplimentary: false,
            demandDepartment: departmentName,
            materialReceivingDepartment: '',
            status: '',
            sort: 1,
            isSelect: true,
            material: this._.find(this.materials, { id: item.materialId })
          })
        }
      } else {
        this.isSelect = false
      }
    },
    handleChange () {
      this.history = true
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
