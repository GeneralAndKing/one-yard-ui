<template lang="pug">
  #one-order
    more-btn(v-if="see")
      v-btn(fab, small, color="green", dark, @click="print")
        v-icon mdi-printer-settings
    v-card
      v-card-title 采购订单{{see? '编辑' : '添加'}}
      v-card-text
        v-form(ref="base")
          v-layout(wrap, style="width:100%")
            v-flex(sm12, md6, lg4)
              v-select(v-model="order.type", :items="orderType", ref="orderType", :disabled='see', @change="generateCode",
                label="单据类型", :rules="rules.unionRules(rules.requiredRules('单据类型'))")
            v-flex(sm12, md6, lg4)
              v-select(v-model="order.supplier" :items="supplier", ref="supplier", :disabled='see', item-text="name", item-value="name",
                label="供应商", :rules="rules.unionRules(rules.requiredRules('供应商'))")
            v-flex(sm12, md6, lg4)
              v-text-field(v-model="order.code" ref="code", label="单据编号", disabled, hint="此字段在选择单据类型后自动生成", persistent-hint,
                :rules="rules.unionRules(rules.requiredRules('单据编号'))")
            v-flex(sm12, md6, lg4)
              date-menu(v-model="order.procurementDate", label="采购日期")
            v-flex(sm12, md6, lg4)
              date-menu(v-model="order.deliveryDate", label="交货日期")
            v-flex(sm12, md6, lg4)
              v-text-field(v-model="order.procurementDepartment" ref="procurementDepartment", label="采购部门", :disabled='see', clearable,
                :rules="rules.unionRules(rules.requiredRules('采购部门'))")
            v-flex(sm12)
              v-text-field(v-model="order.remark" ref="remark", label="备注", :disabled='see', clearable,
                :rules="rules.unionRules(rules.maxLengthRules(250))")
          v-toolbar(flat, color="secondary")
          v-tabs(v-model="tab", show-arrows)
            v-tab(v-for="item in tabs", :key="item.id")
              v-icon(left) {{item.icon}}
              | {{item.name}}
            v-tabs-items.overflow-auto(v-model="tab")
              v-tab-item(:key="1")
                procurement-material(v-model="procurementMaterial", :see="see", :order="order")
              v-tab-item(:key="2")
                order-terms(v-model="orderTerms", :see="see")
              v-tab-item(:key="3")
                v-layout.mt-5(wrap, style="width:100%")
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
      v-card-actions
        slot
        v-spacer
        v-btn(v-if="!see", outlined, color="success", @click="handleSave") 保存
        v-btn(v-else, outlined, color="success", @click="handleSave") 编辑
</template>

<script>
import MoreBtn from '_c/more-btn'
import DateMenu from '_c/date-menu'
import ProcurementMaterial from './ProcurementMaterial'
import OrderTerms from './OrderTerms'
import { orderTypeSelect, formatOrderTypeSelect } from '_u/status'
import { getTime } from '_u/util'
import * as RuleAPI from '_u/rule'

export default {
  name: 'ProcurementOrder',
  components: {
    MoreBtn,
    DateMenu,
    ProcurementMaterial,
    OrderTerms
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
    see: false,
    orderType: orderTypeSelect,
    // TODO:初始化供应商
    supplier: [
      { id: 1, name: '供应商1' },
      { id: 2, name: '供应商2' },
      { id: 3, name: '供应商3' },
      { id: 4, name: '供应商4' }
    ],
    order: {
      id: 1,
      name: '',
      code: '',
      type: '',
      supplier: '',
      procurementDepartment: '',
      procurementDate: '',
      deliveryDate: '',
      // TODO：订单初始化的时候需要指定以下两个状态
      // 这两个类型已经写在了 util/status.js 里面了
      planStatus: 'NO_SUBMIT',
      approvalStatus: 'NO_SUBMIT',
      createTime: '',
      createUser: '',
      modifyTime: '',
      modifyUser: '',
      remark: ''
    },
    tabs: [
      { id: 1, icon: 'mdi-account', name: '明细信息' },
      { id: 2, icon: 'mdi-account', name: '订单条款' },
      { id: 3, icon: 'mdi-account', name: '系统信息' }
    ],
    procurementMaterial: [],
    orderTerms: []
  }),
  computed: {
    rules () {
      return RuleAPI
    }
  },
  async created () {
    if (this.seeItem !== null) {
      // 编辑的时候，只能让他查看！
      this.see = true
    }
    for (let i = 0; i < 5; i++) {
      this.procurementMaterial.push({
        id: i,
        name: `name-${i}`,
        materialId: 1,
        procurementUnit: '个',
        procurementNumber: i + 5,
        supplier: '啊啊啊',
        chargeUnit: '包',
        chargeNumber: i + 1,
        deliveryDate: `2019-01-2${i}`,
        unitPrice: i,
        taxableUnitPrice: i + 3.33,
        taxRate: `${i + 5}%`,
        taxAmount: i + 0.22,
        totalPrice: i + 10.11,
        taxTotalPrice: i + 12.22,
        isComplimentary: false,
        demandDepartment: '采购部门',
        materialReceivingDepartment: '采购部门',
        status: '',
        sort: 1
      })
      this.orderTerms.push({
        name: `${i}条款名称`,
        code: `${i}条款编号`,
        type: `${i}条款类型`,
        content: `${i}条款内容`,
        description: `${i}说明`,
        sort: i
      })
    }
  },
  methods: {
    print () {
      // TODO: 打印
    },
    generateCode () {
      const type = formatOrderTypeSelect(this.order.type)
      this.order.code = `${type}${getTime()}${Math.floor(Math.random() * (9999 - 100000) + 100000)}`
    },
    handleSave () {
      if (this.see) {
        // TODO:编辑事件
      } else {
        // TODO：保存事件
      }
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
