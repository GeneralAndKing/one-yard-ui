<template lang="pug">
  v-container.one-procurement-mangement
    v-card(v-if="see === 0")
      v-card-title 采购计划管理
      v-card-text
        v-container(grid-list-md)
          v-form
            v-layout(wrap, style="width:100%")
              v-flex(sm12, md6, lg4)
                v-text-field(v-model="search.name", label="采购计划名称")
              v-flex(sm12, md6, lg4)
                v-select(v-model="search.planStatus", :items="planStatus", item-value='value', item-text='name', label="需求计划状态")
              v-flex(sm12, md6, lg4)
                v-select(v-model="search.approvalStatus", :items="approvalStatus", item-value='value', item-text='name', label="审批状态")
              v-flex(xs12, md6, lg4)
                v-menu(v-model="dayMenu", :close-on-content-click="false", transition="scale-transition",
                  offset-y, max-width="290px", min-width="290px")
                  template(v-slot:activator="{ on }")
                    v-text-field(v-model="search.createTime", v-on="on", label="创建日期", readonly)
                  v-date-picker(v-model="search.createTime", no-title, @input="dayMenu = false", locale="zh-cn")
          v-data-table(:headers="headers", :items="desserts", :loading="loading", loading-text="加载中......",
            item-key="id", :mobile-breakpoint="800",  :custom-filter="filterSearch", :search="searchValue",
            no-data-text="暂无数据", no-results-text="暂无数据")
            template(v-slot:item.planStatus="{ item }")
              span {{formatPlanStatus(item.planStatus).name}}
            template(v-slot:item.approvalStatus="{ item }")
              span {{formatApprovalStatus(item.approvalStatus).name}}
            template(v-slot:item.createTime="{ item }")
              span {{item.createTime.replace("T", " ")}}
            template(v-slot:item.action="{ item }")
              v-tooltip(top)
                template(v-slot:activator="{ on }")
                  v-btn.mr-2(outlined, rounded, x-small, fab, color="success", v-on="on", @click="handleSee(item)")
                    v-icon remove_red_eye
                span 查看
              v-tooltip(top, v-if="item.planStatus === 'FREE'")
                template(v-slot:activator="{ on }")
                  v-btn.mr-2(outlined, rounded, x-small, fab, color="teal darken-1", v-on="on",
                    v-per="Role.ROLE_PROCUREMENT_PLANER", @click="handleSubmit(item)")
                    v-icon mdi-format-wrap-inline
                span 提交审批
              v-tooltip(top, v-if="item.approvalStatus === 'APPROVAL_ING' && item.planStatus === 'APPROVAL'")
                template(v-slot:activator="{ on }")
                  v-btn.mr-2(outlined, rounded, x-small, fab, color="primary", v-on="on",
                    v-per="Role.ROLE_PROCUREMENT_SUPERVISOR", @click="handleApproval(item)")
                    v-icon mdi-book-open-variant
                span 审批
              v-tooltip(top, v-if="item.approvalStatus === 'APPROVAL_ING' && item.planStatus === 'PROCUREMENT_OK'")
                template(v-slot:activator="{ on }")
                  v-btn.mr-2(outlined, rounded, x-small, fab, color="primary", v-on="on",
                    v-per="Role.ROLE_FINANCE", @click="handleApproval(item)")
                    v-icon mdi-book-open-variant
                span 审批
              v-tooltip(top, v-if="item.approvalStatus === 'APPROVAL_ING' && item.planStatus === 'APPROVAL'")
                template(v-slot:activator="{ on }")
                  v-btn.mr-2(outlined, rounded, x-small, fab, color="warning",
                    v-per="Role.ROLE_PROCUREMENT_PLANER", @click="handleRevoke(item)", v-on="on")
                    v-icon mdi-backup-restore
                span 撤回
          v-snackbar(v-model="revokeSnackbar", vertical, :timeout="0") 您确定撤回吗？
            v-row.justify-end
              v-btn.ma-3(color="error", text, @click="revokeSnackbar = false") 取消
              v-btn.ma-3(color="primary", text, @click="revokeOk") 确定
          v-dialog(v-model="approval.show", max-width="350px")
            v-card
              v-card-title.headline
                span.title 计划审批
                v-spacer
                v-btn(text, color="error", icon, @click="initApproval")
                  v-icon mdi-close
              v-card-text
                v-textarea(v-model="approval.description", label="审批意见", hint="请输入您的审批意见", :rules="rules.union(rules.required('审批意见'))",
                  rows="5", ref='description', auto-grow, counter)
              v-card-actions
                v-spacer
                v-btn(text, color="error", @click="handlePlanApproval('审批退回')") 需求退回
                v-btn(text, color="success", @click="handlePlanApproval('审批通过')") 需求通过
    procurement-plan(v-else, :see-id="see")
      v-btn(text, color='warning', @click="handleBack", outlined) 返回
</template>

<script>
import * as restAPI from '_api/rest'
import * as procurementPlanAPI from '_api/procurementPlan'
import ProcurementPlan from '_c/procurement-plan'
import { planStatus, approvalStatus } from '_u/status'
import { requiredRules, unionRules, requiredMessageRules } from '_u/rule'
import { Role } from '_u/role'

export default {
  name: 'ProcurementPlanManagement',
  components: {
    ProcurementPlan
  },
  data: () => ({
    see: 0,
    planStatus: planStatus,
    approvalStatus: approvalStatus,
    revokeSnackbar: false,
    dayMenu: false,
    loading: false,
    approval: {},
    rules: {
      required: requiredRules,
      requiredMessage: requiredMessageRules,
      union: unionRules
    },
    search: {
      name: '',
      planStatus: '',
      approvalStatus: '',
      createTime: ''
    },
    desserts: [],
    headers: [
      { text: '名称', value: 'name' },
      { text: '计划状态', value: 'planStatus' },
      { text: '审批状态', value: 'approvalStatus' },
      { text: '创建时间', value: 'createTime' },
      { text: '操作', value: 'action', sortable: false, align: 'center' }
    ]
  }),
  created () {
    this.initApproval()
    this.initTable()
  },
  computed: {
    searchValue () {
      return `${this.search.name}&${this.search.planStatus}&${this.search.approvalStatus}&${this.search.createTime}`
    },
    Role () {
      return Role
    }
  },
  methods: {
    initTable () {
      this.loading = true
      let _this = this
      let role = _this.$store.getters['auth/role']
      let resourcesLink = null
      if (role.includes(Role.ROLE_PROCUREMENT_PLANER)) {
        resourcesLink = `procurementPlan/search/byCreateUser?createUser=${this.$store.getters['auth/username']}`
      }
      if (role.includes(Role.ROLE_PROCUREMENT_SUPERVISOR)) {
        resourcesLink = `procurementPlan/search/byStatus?planStatus=APPROVAL&approvalStatus=APPROVAL_ING`
      }
      if (role.includes(Role.ROLE_FINANCE) || role.includes(Role.ROLE_FINANCE_PLANER) || role.includes(Role.ROLE_FINANCE_SUPERVISOR)) {
        resourcesLink = `procurementPlan/search/byStatus?planStatus=PROCUREMENT_OK&approvalStatus=APPROVAL_ING`
      }
      restAPI.getRestLink(resourcesLink)
        .then(res => {
          this.desserts = res.data.content.filter(d => !d.hasOwnProperty('relTargetType'))
        })
        .finally(() => { this.loading = false })
    },
    handleRevoke (item) {
      this.revoke = item
      this.revokeSnackbar = true
    },
    handleSubmit (item) {
      restAPI.patchOne('procurementPlan', item.id, {
        planStatus: 'APPROVAL',
        approvalStatus: 'APPROVAL_ING'
      })
        .then(() => {
          this.$message('提交审批成功！', 'success')
          this.loading = true
          this.initApproval()
          this.desserts = []
          this.initTable()
        })
    },
    initApproval () {
      this.approval = {
        show: false,
        description: '',
        plan: null,
        result: null,
        approvalType: '',
        planId: -1
      }
    },
    revokeOk () {
      let role = ''
      if (this.revoke.approvalStatus === 'APPROVAL_ING' && this.revoke.planStatus === 'APPROVAL') {
        role = 'PLANER'
      } else if (this.revoke.approvalStatus === 'APPROVAL_ING' && this.revoke.planStatus === 'PROCUREMENT_OK') {
        role = 'SUPERVISOR'
      } else {
        this.$message('撤回失败，当前采购计划状态异常，请刷新后再试！', 'error')
        return
      }
      procurementPlanAPI.withdrawApproval(this.revoke, role)
        .then(() => {
          this.revokeSnackbar = false
          this.$message('撤回成功！', 'success')
          this.desserts = []
          this.initTable()
        })
    },
    filterSearch (value, search, item) {
      const condition = search.split('&')
      if (condition[3] === '') condition[3] = new Date()
      return item.name.includes(condition[0]) &&
        item.planStatus.includes(condition[1]) &&
        item.approvalStatus.includes(condition[2]) &&
        new Date(item.createTime.split('T')[0]).getTime() < new Date(condition[3]).getTime()
    },
    formatPlanStatus (planStatus) {
      return this._.find(this.planStatus, { value: planStatus })
    },
    formatApprovalStatus (approvalStatus) {
      return this._.find(this.approvalStatus, { value: approvalStatus })
    },
    handleSee (item) {
      this.see = item.id
    },
    handleBack () {
      this.see = 0
      this.initTable()
    },
    handleApproval (item) {
      this.approval.show = true
      this.approval.description = null
      this.approval.plan = this._.cloneDeep(item)
      if (this.$refs['description']) this.$refs['description'].reset()
    },
    /**
     * 审批方法
     */
    handlePlanApproval (result) {
      if (!this.$refs['description'].validate(true)) return
      if (this.approval.plan.planStatus === 'APPROVAL' && this.approval.plan.approvalStatus === 'APPROVAL_ING') {
        this.approval.approvalType = 'PROCUREMENT_APPROVAL_ONE'
        if (result === '审批通过') {
          this.approval.plan.planStatus = 'PROCUREMENT_OK'
          this.approval.plan.approvalStatus = 'APPROVAL_ING'
        } else {
          this.approval.plan.planStatus = 'FREE'
          this.approval.plan.approvalStatus = 'NO_SUBMIT'
        }
      } else if (this.approval.plan.planStatus === 'PROCUREMENT_OK' && this.approval.plan.approvalStatus === 'APPROVAL_ING') {
        this.approval.approvalType = 'PROCUREMENT_APPROVAL_TWO'
        if (result === '审批通过') {
          this.approval.plan.planStatus = 'FINALLY'
          this.approval.plan.approvalStatus = 'APPROVAL_OK'
        } else {
          this.approval.plan.planStatus = 'FREE'
          this.approval.plan.approvalStatus = 'NO_SUBMIT'
        }
      }
      this.approval.result = result
      this.approval.planId = this.approval.plan.id
      procurementPlanAPI.approvalProcurementPlan(this.approval.plan, this.approval)
        .then(() => {
          this.approval.show = false
          this.$message('审批成功！', 'success')
          this.desserts = []
          this.initTable()
        })
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
