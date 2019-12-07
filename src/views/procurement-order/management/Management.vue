<template lang="pug">
  v-container.one-managment
    v-scroll-y-transition(mode="out-in")
      v-card(v-if="see === null")
        v-card-title 采购订单管理
        v-card-text
          v-container(grid-list-md)
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
          management-table.mt-5(v-model="orders", :search="searchValue", :loading="load.table", @see="handleSee")
      procurement-order(v-else, :seeItem="see")
        v-btn(outlined, color="warning", @click="handleBack") 返回
</template>

<script>
import { orderType, procurementOrderPlanStatus, approvalStatus } from '_u/status'
import ManagementTable from './ManagementTable'
import DateMenu from '_c/date-menu'
import ProcurementOrder from '_c/procurement-order'
import { tomorrow } from '_u/util'
import * as RestAPI from '_api/rest'
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
    tomorrow: tomorrow(),
    load: {
      table: false
    }
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
    this.initData()
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
      console.log(this.see)
    },
    initData () {
      this.orders.length = 0
      this.load.table = true
      RestAPI.getAll('procurementOrder').then(res => {
        this.orders.push(...res.data.content)
      }).finally(() => { this.load.table = false })
    },
    handleBack () {
      this.see = null
      this.initData()
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
