<template lang="pug">
  v-container.one-managment
    v-scroll-y-transition(mode="out-in")
      v-card(v-if="see === null")
        v-card-title 采购订单管理
        v-card-text
          v-layout(wrap, style="width:100%")
            v-flex(sm12, md6, lg4)
              v-select(v-model="search.type", :items="orderType", label="单据类型")
            v-flex(sm12, md6, lg4)
              v-select(v-model="search.planStatus", :items="planStatus", label="订单状态", item-text="name", item-value="value")
            v-flex(sm12, md6, lg4)
              v-select(v-model="search.approvalStatus", :items="approvalStatus", label="审批状态", item-text="name", item-value="value")
            v-flex(sm12, md6, lg4)
              v-select(v-model="search.supplier" :items="supplier", ref="supplier", item-text="name", item-value="name", label="供应商")
            v-flex(sm12, md6, lg4)
              date-menu(v-model="search.procurementDate", label="采购日期", :init="tomorrow")
            v-flex(sm12, md6, lg4)
              date-menu(v-model="search.deliveryDate", label="交货日期", :init="tomorrow")
            v-flex.text-right(sm12)
              v-btn(outlined, color="secondary", @click="handleReset") 重置条件
          management-table.mt-5(v-model="orders", :search="searchValue", @see="handleSee")
      procurement-order(v-else, :seeItem="see")
        v-btn(outlined, color="warning", @click="handleBack") 返回
</template>

<script>
import { orderType, procurementOrderPlanStatus, approvalStatus } from '_u/status'
import ManagementTable from './ManagementTable'
import DateMenu from '_c/date-menu'
import ProcurementOrder from '_c/procurement-order'
import { tomorrow } from '_u/util'
export default {
  name: 'Management',
  components: {
    DateMenu,
    ManagementTable,
    ProcurementOrder
  },
  data: () => ({
    see: null,
    search: {},
    // TODO:初始化供应商, 此处必须在数组头添加一个id为0,name为 '' 的元素
    supplier: [
      { id: 0, name: '' },
      { id: 1, name: '供应商1' },
      { id: 2, name: '供应商2' },
      { id: 3, name: '供应商3' },
      { id: 4, name: '供应商4' }
    ],
    orderType: orderType,
    planStatus: procurementOrderPlanStatus,
    approvalStatus: approvalStatus,
    orders: [],
    tomorrow: tomorrow()
  }),
  computed: {
    searchValue () {
      const search = this.search
      return `${search.type}&${search.supplier}&${search.procurementDate}` +
        `&${search.deliveryDate}&${search.planStatus}&${search.approvalStatus}`
    }
  },
  created () {
    this.handleReset()
    // TODO：初始化采购订单数据
    for (let i = 0; i < 5; i++) {
      this.orders.push({
        id: i,
        name: `订单${i}`,
        code: `编号${i}`,
        type: `订单类型${i}`,
        supplier: `供应商${i}`,
        procurementDepartment: `采购部门${i}`,
        procurementDate: '2019-10-11',
        deliveryDate: '2019-10-11',
        planStatus: 'NO_SUBMIT',
        approvalStatus: 'NO_SUBMIT'
      })
    }
  },
  methods: {
    handleReset () {
      this.search = {
        type: '',
        supplier: '',
        procurementDate: this.tomorrow.substring(0, 10),
        deliveryDate: this.tomorrow.substring(0, 10),
        planStatus: '',
        approvalStatus: ''
      }
    },
    handleSee (item) {
      // 点击查看的时候，跳转过去
      this.see = item
    },
    handleBack () {
      this.see = null
      // TODO：返回回来以后，需要重新初始化一下表格数据，以防更新不及时
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
