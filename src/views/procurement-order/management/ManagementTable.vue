<template lang="pug">
  .management-table
    approve-confirm(v-model="approvalContent", ref="approval", title="采购订单审批", @submit="handleApproval", :auto="false")
    v-data-table(:headers="headers", :items="value", item-key="id", loading-text="正在加载数据", :loading="loading",
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
        v-tooltip(top v-if="item.approvalStatus==='APPROVAL_OK'&&item.planStatus==='EFFECTIVE'")
          template(v-slot:activator="{ on }")
            v-btn.mr-1(outlined, rounded, x-small, fab, color="#FFC400", v-on="on",
              v-per="[Role.ROLE_PROCUREMENT_PLANER]",
              @click="handleChange(item)")
              v-icon mdi-message-draw
          span 变更
        v-tooltip(top v-if="item.approvalStatus==='APPROVAL_OK'&&item.planStatus==='EFFECTIVE'")
          template(v-slot:activator="{ on }")
            v-btn.mr-1(outlined, rounded, x-small, fab, color="#6200ee", v-on="on",
              v-per="[Role.ROLE_PROCUREMENT_PLANER]",
              @click="handleFinished(item)")
              v-icon mdi-check
          span 订单完成
        v-tooltip(top v-if="item.planStatus==='NO_SUBMIT'&&(item.approvalStatus==='NO_SUBMIT'||item.approvalStatus==='APPROVAL_NO')")
          template(v-slot:activator="{ on }")
            v-btn.mr-1(outlined, rounded, x-small, fab, color="teal darken-1", v-on="on",
              v-per="[Role.ROLE_PROCUREMENT_PLANER]",
              @click="handleSubmit(item)")
              v-icon mdi-format-wrap-inline
          span 提交审批
        v-tooltip(top v-if="item.approvalStatus==='APPROVAL_ING'")
          template(v-slot:activator="{ on }")
            v-btn.mr-1(outlined, rounded, x-small, fab, color="info", v-on="on",
              v-per="[Role.ROLE_PROCUREMENT_SUPERVISOR]",
              @click="showApproval(item)")
              v-icon mdi-book-open-variant
          span 审批
        v-tooltip(top v-if="item.planStatus==='APPROVAL'&&item.approvalStatus==='APPROVAL_ING'")
          template(v-slot:activator="{ on }")
            v-btn.mr-1(outlined, rounded, x-small, fab, color="warning", v-on="on",
              v-per="[Role.ROLE_PROCUREMENT_PLANER]",
              @click="handleRevoke(item)")
              v-icon mdi-backup-restore
          span 撤回
        v-tooltip(top v-if="item.approvalStatus==='APPROVAL_OK'&&item.planStatus==='EFFECTIVE'")
          template(v-slot:activator="{ on }")
            v-btn(outlined, rounded, x-small, fab, color="error", v-on="on",
              v-per="[Role.ROLE_PROCUREMENT_PLANER]",
              @click="handleCancel(item)")
              v-icon mdi-link-off
          span 取消订单
        v-tooltip(top v-if="(item.approvalStatus==='NO_SUBMIT' ||item.approvalStatus==='APPROVAL_NO') && item.planStatus==='NO_SUBMIT'")
          template(v-slot:activator="{ on }")
            v-btn(outlined, rounded, x-small, fab, color="error", v-on="on",
              v-per="[Role.ROLE_PROCUREMENT_PLANER]",
              @click="handleDelete(item)")
              v-icon mdi-delete
          span 删除
</template>

<script>
import { procurementOrderPlanStatus, approvalStatus } from '_u/status'
import ApproveConfirm from '_c/approve-confirm'
import * as procurementOrderAPI from '_api/procurementOrder'
import * as RestAPI from '_api/rest'
import { Role } from '_u/role'

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
    loading: {
      type: Boolean,
      default: false
    },
    search: {
      type: String,
      default: ''
    }
  },
  computed: {
    Role () {
      return Role
    }
  },
  data: () => ({
    approvalContent: '',
    approvalType: '',
    headers: [
      { text: '订单名称', value: 'name', align: 'start' },
      { text: '订单类型', value: 'type', align: 'start' },
      { text: '单据编号', value: 'code', align: 'start' },
      { text: '供应商', value: 'supplier', align: 'start' },
      { text: '需求部门', value: 'procurementDepartment', align: 'start' },
      { text: '采购日期', value: 'procurementDate', align: 'start' },
      { text: '交货日期', value: 'deliveryDate', align: 'start' },
      { text: '计划状态', value: 'planStatus', align: 'start' },
      { text: '审批状态', value: 'approvalStatus', align: 'start' },
      { text: '操作', value: 'action', sortable: false, width: '210px', align: 'center' }
    ],
    approvalItem: null
  }),
  methods: {
    filterSearch (value, search, item) {
      const condition = search.split('&')
      if (condition[3] === '') condition[3] = new Date('2999-12-06 0:0:0')
      if (condition[4] === '') condition[4] = new Date('2999-12-06 0:0:0')
      return item.name.includes(condition[0]) &&
          item.type.includes(condition[1]) &&
          item.supplier.includes(condition[2]) &&
          new Date(item.procurementDate).getTime() < new Date(condition[3]).getTime() &&
          new Date(item.deliveryDate).getTime() < new Date(condition[4]).getTime() &&
          item.planStatus.includes(condition[5]) &&
          item.approvalStatus.includes(condition[6])
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
    handleChange (item) {
      this.$emit('change', item)
    },
    handleSubmit (item) {
      this.$confirm({ title: '您确认提交审批吗？' },
        () => {
          RestAPI.patchOne(`procurementOrder`, item.id,
            { planStatus: 'APPROVAL', approvalStatus: 'APPROVAL_ING' })
            .then(() => {
              this.$message('提交审批成功', 'success')
              item.planStatus = 'APPROVAL'
              item.approvalStatus = 'APPROVAL_ING'
              this.$emit('init')
            })
        })
    },
    handleFinished (item) {
      this.$confirm({ title: '您确定标记此订单为完成状态吗？', content: '<b class="font-weight-bold red--text">注意：此操作不可逆</b>' },
        () => {
          RestAPI.patchOne(`procurementOrder`, item.id, { planStatus: 'APPROVAL_CANCEL' })
            .then(() => {
              item.planStatus = 'APPROVAL_CANCEL'
              this.$message('操作成功', 'success')
              this.$emit('init')
            })
        })
    },
    handleRevoke (item) {
      this.$confirm({ title: '您确认撤回吗？' },
        () => {
          procurementOrderAPI.withdrawApproval(item.id).then(() => {
            this.$message('撤回成功', 'success')
            item.planStatus = 'NO_SUBMIT'
            item.approvalStatus = 'NO_SUBMIT'
            this.$emit('init')
          })
        })
    },
    handleDelete (item) {
      this.$confirm({ title: '删除后其中需求物资将解除绑定同时订单不可查看，您确认删除改订单吗？' },
        () => {
          procurementOrderAPI.deleteProcurementOrder(item.id).then(res => {
            this.$message('删除采购订单成功！', 'success')
            this.value.splice(this._.indexOf(this.value, item), 1)
            this.$emit('init')
          })
        })
    },
    handleCancel (item) {
      this.$confirm({ title: '取消请求将由主管进行审批许可，成功取消后可在"采购订单管理" -> 选择已取消筛选查看，您确认取消该订单吗？' },
        () => {
          RestAPI.patchOne(`procurementOrder`, item.id, { planStatus: 'APPROVAL_CANCEL',
            approvalStatus: 'APPROVAL_ING' }).then(res => {
            this.$message('发起取消请求成功！等待采购部门主管审批。', 'success')
            item.planStatus = 'APPROVAL_CANCEL'
            item.approvalStatus = 'APPROVAL_ING'
            this.value.splice(this._.indexOf(this.value, item), 1)
            this.$emit('init')
          })
        })
    },
    // 普通审批
    handleApproval (flag) {
      let approval = {
        description: this.approvalContent,
        approvalType: 2,
        planId: this.approvalItem.id
      }
      if (flag) {
        approval.result = '审核通过'
      } else {
        approval.result = '审核不通过'
      }
      this.$refs.approval.loading = true
      procurementOrderAPI.approvalProcurementOrder(this.approvalItem, approval)
        .then(() => {
          this.$message('审批成功', 'success')
          if (flag) {
            if (this.approvalType === '普通审批') {
              this.approvalItem.planStatus = 'EFFECTIVE'
            } else if (this.approvalType === '变更审批') {
              this.approvalItem.planStatus = 'EFFECTIVE'
            } else if (this.approvalType === '取消审批') {
              this.approvalItem.planStatus = 'CANCEL'
            }
            this.approvalItem.approvalStatus = 'APPROVAL_OK'
          } else {
            if (this.approvalType === '普通审批') {
              this.approvalItem.approvalStatus = 'APPROVAL_NO'
              this.approvalItem.planStatus = 'NO_SUBMIT'
            } else if (this.approvalType === '变更审批') {
              this.approvalItem.approvalStatus = 'EFFECTIVE'
              this.approvalItem.planStatus = 'APPROVAL_OK'
            } else if (this.approvalType === '取消审批') {
              this.approvalItem.approvalStatus = 'EFFECTIVE'
              this.approvalItem.planStatus = 'APPROVAL_OK'
            }
          }
          this.$emit('init')
        })
        .finally(() => {
          this.$refs.approval.loading = false
          this.approvalContent = ''
          this.$refs.approval.dialog = false
        })
    },
    showApproval (item) {
      if (item.planStatus === 'APPROVAL' && item.approvalStatus === 'APPROVAL_ING') {
        this.approvalType = '普通审批'
      } else if (item.planStatus === 'APPROVAL_CANCEL' && item.approvalStatus === 'APPROVAL_ING') {
        this.approvalType = '取消审批'
      } else if (item.planStatus === 'CHANGED' && item.approvalStatus === 'APPROVAL_ING') {
        this.approvalType = '变更审批'
      } else {
        this.message('订单状态错误，不可进行审批，刷新后再试！', 'error')
        return
      }
      this.approvalItem = item
      this.$refs.approval.dialog = true
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
