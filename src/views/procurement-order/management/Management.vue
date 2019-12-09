<template lang="pug">
  v-container.one-managment
    v-scroll-y-transition(mode="out-in")
      v-card(v-if="see === null")
        v-scroll-y-transition(mode="out-in")
          skeleton-loader(v-if="skeletonLoader")
          div(v-else)
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
                    span(v-per="[Role.ROLE_PROCUREMENT_SUPERVISOR]")
                      v-btn.mr-4(outlined, color="secondary", @click="search.planStatus = 'APPROVAL_CANCEL'") (主管) 取消审批
                      v-btn.mr-4(outlined, color="secondary", @click="search.planStatus = 'CHANGED'") (主管) 变跟审批
                      v-btn.mr-4(outlined, color="secondary", @click="search.planStatus = 'APPROVAL'") (主管) 提交审批
                    v-btn(outlined, color="warning", @click="handleReset") 重置条件
              management-table.mt-5(v-model="orders", :search="searchValue", :loading="load.table", @see="handleSee" @change="handleChange")
      procurement-order(v-else, :seeItem="see" @back="handleBack")
        v-btn(outlined, color="warning", @click="handleBack") 返回
</template>

<script>
import { orderType, procurementOrderPlanStatus, approvalStatus } from '_u/status'
import ManagementTable from './ManagementTable'
import DateMenu from '_c/date-menu'
import ProcurementOrder from '_c/procurement-order'
import { tomorrow } from '_u/util'
import * as restAPI from '_api/rest'
import SkeletonLoader from '_c/skeleton-loader'
import { Role } from '_u/role'

export default {
  name: 'Management',
  components: {
    DateMenu,
    ManagementTable,
    ProcurementOrder,
    SkeletonLoader
  },
  data: () => ({
    see: null,
    search: {},
    skeletonLoader: true,
    supplier: [{ id: 0, name: '' }],
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
    },
    Role () {
      return Role
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
      item.isChange = false
      this.see = item
    },
    handleChange (item) {
      item.isChange = true
      this.see = item
    },
    initData () {
      this.orders.length = 0
      this.load.table = true
      restAPI.getAll('supplier').then(res => { this.supplier.push(...res.data.content) })
      restAPI.getAll('procurementOrder').then(res => { this.orders.push(...res.data.content) })
        .finally(() => {
          this.load.table = false
          this.skeletonLoader = false
        })
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
