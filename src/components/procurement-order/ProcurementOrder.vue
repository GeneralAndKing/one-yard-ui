<template lang="pug">
  v-container#one-order
    more-btn(v-if="seeId > 0")
      v-btn(fab, small, color="green", dark, @click="print")
        v-icon mdi-printer-settings
    v-card
      v-card-title 采购订单{{see? '添加' : '编辑'}}
      v-card-text
        v-form(ref="base")
          v-layout(wrap, style="width:100%")
            v-flex(sm12, md6, lg4)
              v-select(:items="orderType", ref="orderType", :disabled='see', @change="generateCode", clearable,
                label="单据类型" :rules="rules.unionRules(rules.requiredRules('单据类型'))")
            v-flex(sm12, md6, lg4)
              v-select(:items="supplier", ref="supplier", :disabled='see', clearable,
                label="供应商" :rules="rules.unionRules(rules.requiredRules('供应商'))")
            v-flex(sm12, md6, lg4)
              v-text-field(ref="code", label="单据编号", disabled, hint="此字段在选择单据类型后自动生成", persistent-hint,
                :rules="rules.unionRules(rules.requiredRules('单据编号'))", clearable,)
            v-flex(sm12, md6, lg4)
              date-menu(v-model="date", label="采购日期")
            v-flex(sm12, md6, lg4)
              v-text-field(ref="procurementDepartment", label="采购部门", :disabled='see', clearable,
                :rules="rules.unionRules(rules.requiredRules('采购部门'))")
            v-flex(sm12, md6, lg4)
              v-text-field(ref="remark", label="备注", :disabled='see', clearable,
                :rules="rules.unionRules(rules.maxLengthRules(250))")

</template>

<script>
import MoreBtn from '_c/more-btn/MoreBtn'
import DateMenu from '_c/date-menu/DateMenu'
import * as RuleAPI from '_u/rule'

export default {
  name: 'ProcurementOrder',
  components: {
    MoreBtn,
    DateMenu
  },
  props: {
    // 如果是编辑，那么 seeId 不为 0
    seeId: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    // 是否是查看
    date: '',
    see: false,
    orderType: [
      { name: '标准采购订单', value: 'CG1001' },
      { name: '框架协议订单', value: 'CG1002' },
      { name: '紧急订单', value: 'CG1003' }
    ],
    supplier: [
      { id: 1, name: '供应商1' },
      { id: 2, name: '供应商2' },
      { id: 3, name: '供应商3' },
      { id: 4, name: '供应商4' }
    ]
  }),
  computed: {
    rules () {
      return RuleAPI
    }
  },
  async created () {
    // 编辑的时候
    if (this.seeId !== 0) {
      this.see = true
    }
  },
  methods: {
    print () {
      // TODO: 打印
    },
    generateCode () {
      // TODO: 生成订单号
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
