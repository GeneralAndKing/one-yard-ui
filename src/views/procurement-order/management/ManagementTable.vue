<template lang="pug">
  .management-table
    v-data-table(:headers="headers", :items="value", item-key="id", loading-text="正在加载数据",
      no-data-text="暂无数据", no-results-text="没有匹配的数据", :search="search", :custom-filter="filterSearch")
      template(v-slot:item.planStatus="{ item }")
        span {{formatPlanStatus(item.planStatus)}}
      template(v-slot:item.approvalStatus="{ item }")
        span {{formatApprovalStatus(item.approvalStatus)}}
      template(v-slot:item.action="{ item }")
        v-tooltip(top)
          template(v-slot:activator="{ on }")
            v-btn.mr-2(outlined, rounded, x-small, fab, color="success", v-on="on", @click="handleSee(item)")
              v-icon remove_red_eye
          span 查看
        v-tooltip(top)
          template(v-slot:activator="{ on }")
            v-btn.mr-2(outlined, rounded, x-small, fab, color="teal darken-1", v-on="on", @click="handleSubmit(item)")
              v-icon mdi-format-wrap-inline
          span 提交审批
        v-tooltip(top)
          template(v-slot:activator="{ on }")
            v-btn.mr-2(outlined, rounded, x-small, fab, color="info", v-on="on", @click="handleApproval(item)")
              v-icon mdi-book-open-variant
          span 审批
        v-tooltip(top)
          template(v-slot:activator="{ on }")
            v-btn.mr-2(outlined, rounded, x-small, fab, color="warning", v-on="on", @click="handleRevoke(item)")
              v-icon mdi-backup-restore
          span 撤回
</template>

<script>
import { procurementOrderPlanStatus, approvalStatus } from '_u/status'

export default {
  name: 'ManagementTable',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    search: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    headers: [
      { text: '订单类型', value: 'type', align: 'start' },
      { text: '单据编号', value: 'code', align: 'start' },
      { text: '供应商', value: 'supplier', align: 'start' },
      { text: '需求部门', value: 'procurementDepartment', align: 'start' },
      { text: '采购日期', value: 'procurementDate', align: 'start' },
      { text: '交货日期', value: 'deliveryDate', align: 'start' },
      { text: '计划状态', value: 'planStatus', align: 'start' },
      { text: '审批状态', value: 'approvalStatus', align: 'start' },
      { text: '操作', value: 'action', sortable: false, width: '200px', align: 'center' }
    ]
  }),
  methods: {
    filterSearch (value, search, item) {
      const condition = search.split('&')
      return item.type.includes(condition[0]) &&
        item.supplier.includes(condition[1]) &&
        new Date(item.procurementDate).getTime() < new Date(condition[2]).getTime() &&
        new Date(item.deliveryDate).getTime() < new Date(condition[3]).getTime() &&
        item.planStatus.includes(condition[4]) &&
        item.approvalStatus.includes(condition[5])
    },
    formatPlanStatus (type) {
      return this._.find(procurementOrderPlanStatus, { value: type }).name
    },
    formatApprovalStatus (type) {
      return this._.find(approvalStatus, { value: type }).name
    },
    handleSee (item) {
      this.$emit('see', item)
    },
    handleSubmit (item) {
      // TODO:提交审批事件
    },
    handleApproval (item) {
      // TODO:审批事件
    },
    handleRevoke (item) {
      // TODO:撤回事件
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
