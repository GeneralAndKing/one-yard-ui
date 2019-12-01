<template lang="pug">
  .management-table
    approve-confirm(v-model="approvalContent", ref="approval", title="采购订单", @submit="handleApproval")
    v-data-table(:headers="headers", :items="value", item-key="id", loading-text="正在加载数据",
      no-data-text="暂无数据", no-results-text="没有匹配的数据", :search="search", :custom-filter="filterSearch")
      template(v-slot:item.planStatus="{ item }")
        span {{formatPlanStatus(item.planStatus)}}
      template(v-slot:item.approvalStatus="{ item }")
        span {{formatApprovalStatus(item.approvalStatus)}}
      template(v-slot:item.action="{ item }")
        v-tooltip(top)
          template(v-slot:activator="{ on }")
            v-btn.mr-1(outlined, rounded, x-small, fab, color="success", v-on="on", @click="handleSee(item)")
              v-icon remove_red_eye
          span 查看
        v-tooltip(top)
          template(v-slot:activator="{ on }")
            v-btn.mr-1(outlined, rounded, x-small, fab, color="teal darken-1", v-on="on", @click="handleSubmit(item)")
              v-icon mdi-format-wrap-inline
          span 提交审批
        v-tooltip(top)
          template(v-slot:activator="{ on }")
            v-btn.mr-1(outlined, rounded, x-small, fab, color="info", v-on="on", @click="$refs.approval.dialog = true")
              v-icon mdi-book-open-variant
          span 审批
        v-tooltip(top)
          template(v-slot:activator="{ on }")
            v-btn.mr-1(outlined, rounded, x-small, fab, color="warning", v-on="on", @click="handleRevoke(item)")
              v-icon mdi-backup-restore
          span 撤回
        v-tooltip(top)
          template(v-slot:activator="{ on }")
            v-btn(outlined, rounded, x-small, fab, color="error", v-on="on", @click="handleDelete(item)")
              v-icon mdi-delete
          span 删除
</template>

<script>
import { procurementOrderPlanStatus, approvalStatus } from '_u/status'
import ApproveConfirm from '_c/approve-confirm'

export default {
  name: 'ManagementTable',
  components: {
    ApproveConfirm
  },
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
    approvalContent: '',
    headers: [
      { text: '订单类型', value: 'type', align: 'start' },
      { text: '单据编号', value: 'code', align: 'start' },
      { text: '供应商', value: 'supplier', align: 'start' },
      { text: '需求部门', value: 'procurementDepartment', align: 'start' },
      { text: '采购日期', value: 'procurementDate', align: 'start' },
      { text: '交货日期', value: 'deliveryDate', align: 'start' },
      { text: '计划状态', value: 'planStatus', align: 'start' },
      { text: '审批状态', value: 'approvalStatus', align: 'start' },
      { text: '操作', value: 'action', sortable: false, width: '210px', align: 'center' }
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
      this.$confirm({ title: '您确认提交审批吗？' },
        () => {
          // TODO:提交审批事件
        })
    },
    handleRevoke (item) {
      this.$confirm({ title: '您确认撤回吗？' },
        () => {
          // TODO:撤回事件
        })
    },
    handleDelete (item) {
      this.$confirm({ title: '您确认删除吗？' },
        () => {
          // TODO:删除事件
          this.value.splice(this._.indexOf(this.value, item), 1)
        })
    },
    handleApproval (flag) {
      if (flag) {
        // TODO：审批通过, 处理完毕以后记得要使用 this.approvalContent = '' 清空
        console.log('OK:' + this.approvalContent)
      } else {
        // TODO：审批拒绝, 处理完毕以后记得要使用 this.approvalContent = '' 清空
        console.log('FAIL:' + this.approvalContent)
      }
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
