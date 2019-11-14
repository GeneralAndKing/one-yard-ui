<template lang="pug">
  v-container.one-plan-mangement(v-if="see < 1")
    v-card
      v-card-title 计划表管理
      v-card-text
        v-container(grid-list-md)
          v-form
            v-layout(wrap, style="width:100%")
              v-flex(sm12, md6, lg4)
                v-text-field(v-model="search.name", label="需求计划名称")
              v-flex(sm12, md6, lg4)
                v-select(v-model="search.planType", :items="planTypes", label="需求计划类型")
              v-flex(sm12, md6, lg4)
                v-text-field(v-model="search.needPeople", label="需求人员")
              v-flex(sm12, md6, lg4)
                v-select(v-model="search.planStatus", :items="planStatus", item-value='value', item-text='name', label="需求计划状态")
              v-flex(sm12, md6, lg4)
                v-select(v-model="search.approvalStatus", :items="approvalStatus", item-value='value', item-text='name', label="审批状态")
              v-flex(xs12, md6, lg4)
                v-menu(v-model="dayMenu", :close-on-content-click="false", transition="scale-transition",
                  offset-y, max-width="290px", min-width="290px")
                  template(v-slot:activator="{ on }")
                    v-text-field(v-model="search.createTime", v-on="on", label="需求日期", readonly)
                  v-date-picker(v-model="search.createTime", no-title, @input="dayMenu = false", locale="zh-cn")
          v-data-table(:headers="headers", :items="materialPlan", :loading="loading", loading-text="加载中......",
            item-key="id", :mobile-breakpoint="900",  :custom-filter="filterSearch", :search="searchValue",
            no-data-text="暂无数据", no-results-text="暂无数据")
            template(v-slot:item.planStatus="{ item }")
              span {{formatPlanStatus(item.planStatus).name}}
            template(v-slot:item.approvalStatus="{ item }")
              span {{formatApprovalStatus(item.approvalStatus).name}}
            template(v-slot:item.planType="{ item }")
              v-chip(:color="item.planType === '紧急计划' ? 'error' : 'blue'", dark) {{item.planType}}
            template(v-slot:item.createTime="{ item }")
              p(v-html="dateFormat(item.createTime)")
            template(v-slot:item.action="{ item }")
              v-tooltip(top)
                template(v-slot:activator="{ on }")
                  v-btn.mr-2(outlined, rounded, x-small, fab, color="success", @click="handleSee(item)", v-on="on")
                    v-icon remove_red_eye
                span 查看
              v-tooltip(top, v-if="item.approvalStatus === 'APPROVAL_ING' && item.planStatus === 'APPROVAL'")
                template(v-slot:activator="{ on }")
                  v-btn.mr-2(outlined, rounded, x-small, fab, color="primary", @click="handleApproval(item)", v-on="on")
                    v-icon mdi-book-open-variant
                span 审批
              v-tooltip(top, v-if="item.approvalStatus === 'APPROVAL_ING' && item.planStatus === 'APPROVAL'")
                template(v-slot:activator="{ on }")
                  v-btn.mr-2(outlined, rounded, x-small, fab, color="warning", @click="handleRevoke(item)", v-on="on")
                    v-icon mdi-backup-restore
                span 撤回
              v-tooltip(top)
                template(v-slot:activator="{ on }")
                  v-btn.mr-2(outlined, rounded, x-small, fab, color="error", @click="handleDelete(item)", v-on="on")
                    v-icon mdi-delete
                span 删除
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
                v-btn(text, color="error", @click="handlePlanApproval('FREE', 'APPROVAL_NO', '审批退回')") 需求退回
                v-btn(text, color="success", @click="handlePlanApproval('SUMMARY', 'APPROVAL_ING', '审批通过')") 需求通过
  material-plan(v-else, :see-id="see")
    v-btn(text, color="primary", @click="handleBack") 返回
</template>

<script>
import { requiredRules, unionRules, requiredMessageRules } from '_u/rule'
import * as restAPI from '_api/rest'
import * as materialPlanAPI from '_api/materialPlan'
import MaterialPlan from '_c/material-plan'

export default {
  name: 'MaterialPlanManagement',
  components: {
    MaterialPlan
  },
  data: () => ({
    materialPlan: [],
    revokeSnackbar: false,
    dayMenu: false,
    see: 0,
    approval: {},
    search: {
      name: '',
      planType: '',
      needPeople: '',
      planStatus: '',
      approvalStatus: '',
      createTime: ''
    },
    planTypes: [ '', '订单型需求计划', '年度计划', '月度计划', '紧急计划' ],
    planStatus: [
      { name: '', value: '' },
      { name: '自由', value: 'FREE' },
      { name: '提交审批', value: 'APPROVAL' },
      { name: '提交至汇总', value: 'SUMMARY' },
      { name: '已删除', value: 'DELETED' },
      { name: '已终止', value: 'FINALLY' }
    ],
    approvalStatus: [
      { name: '', value: '' },
      { name: '未提交', value: 'NO_SUBMIT' },
      { name: '审批中', value: 'APPROVAL_ING' },
      { name: '审批通过', value: 'APPROVAL_OK' },
      { name: '审批退回', value: 'APPROVAL_NO' }
    ],
    loading: false,
    rules: {
      required: requiredRules,
      requiredMessage: requiredMessageRules,
      union: unionRules
    },
    revoke: null,
    headers: [
      { text: '编码', value: 'id' },
      { text: '名称', value: 'name' },
      { text: '计划类型', value: 'planType' },
      { text: '需求人员', value: 'needPeople' },
      { text: '计划状态', value: 'planStatus' },
      { text: '审批状态', value: 'approvalStatus' },
      { text: '创建时间', value: 'createTime' },
      { text: '操作', value: 'action', sortable: false, align: 'center' }
    ],
    roles: []
  }),
  computed: {
    searchValue () {
      return `${this.search.name}&${this.search.planType}&${this.search.needPeople}&${this.search.planStatus}&${this.search.approvalStatus}&${this.search.createTime}`
    }
  },
  created () {
    this.loading = true
    this.initApproval()
    this.initData()
    this.roles = this.$store.getters['auth/role']
  },
  methods: {
    initData () {
      let _this = this
      restAPI.getAll('materialDemandPlan')
        .then(res => {
          res.data.content.forEach(p => {
            p.createTime = _this.dateFormat(p.createTime)
          })
          _this.materialPlan = res.data.content
        })
        .finally(() => { this.loading = false })
    },
    initApproval () {
      this.approval = {
        show: false,
        description: '',
        plan: null,
        result: null,
        approvalType: 'MATERIAL_APPROVAL',
        planId: -1
      }
    },
    formatPlanStatus (planStatus) {
      return this._.find(this.planStatus, { value: planStatus })
    },
    formatApprovalStatus (approvalStatus) {
      return this._.find(this.approvalStatus, { value: approvalStatus })
    },
    dateFormat (date) {
      return date.replace('T', '&nbsp;&nbsp;')
    },
    handleSee (item) {
      this.see = item.id
    },
    /**
     * 审批按钮事件
     **/
    handleApproval (item) {
      this.approval.show = true
      this.approval.description = null
      this.approval.plan = this._.cloneDeep(item)
      if (this.$refs['description']) this.$refs['description'].reset()
    },
    /**
     * 删除
     **/
    handleDelete (item) {
      restAPI.patchOne('materialDemandPlan', item.id, {
        planStatus: 'DELETED'
      }).then(() => {
        this.$message('需求计划删除成功', 'success')
        item.planStatus = '已删除'
      })
    },
    handleRevoke (item) {
      this.revoke = item
      this.revokeSnackbar = true
    },
    revokeOk () {
      // TODO: 具体撤回操作
      // restAPI.patchOne('materialDemandPlan', this.revoke.id, {
      //   planStatus: 'FREE',
      //   approvalStatus: 'NO_SUBMIT'
      // }).then(res => {
      //   this.$message('撤回成功', 'success')
      //   this.revoke.planStatus = 'FREE'
      //   this.revoke.approvalStatus = 'NO_SUBMIT'
      this.revokeSnackbar = false
      // })
    },
    /**
     * 返回
     **/
    handleBack () {
      this.see = 0
      this.initData()
    },
    /**
     * 搜索过滤
     **/
    filterSearch (value, search, item) {
      const condition = search.split('&')
      const createDate = item.createTime.split('&nbsp;&nbsp;')[0]
      if (condition[5] === '') condition[5] = new Date()
      return item.name.includes(condition[0]) &&
        item.planType.includes(condition[1]) &&
        item.needPeople.includes(condition[2]) &&
        item.planStatus.includes(condition[3]) &&
        item.approvalStatus.includes(condition[4]) &&
        new Date(createDate).getTime() < new Date(condition[5]).getTime()
    },
    /**
     * 审批方法
     */
    handlePlanApproval (planStatus, approvalStatus, result) {
      if (!this.$refs['description'].validate(true)) return
      this.approval.plan.planStatus = planStatus
      this.approval.plan.approvalStatus = approvalStatus
      this.approval.result = result
      this.approval.planId = this.approval.plan.id
      this.approval.plan.createTime = this.approval.plan.createTime.replace('&nbsp;&nbsp;', 'T')
      this.approval.approvalType = 'MATERIAL_APPROVAL'
      if (this.approval.plan.planType === '紧急计划' && result === '审批通过') {
        this.approval.plan.planStatus = 'FINALLY'
        this.approval.plan.approvalStatus = 'APPROVAL_OK'
      }
      materialPlanAPI.approvalMaterialPlan(this.approval.plan, this.approval)
        .then(() => {
          this.initData()
          this.approval.show = false
          this.$message('审批成功！', 'success')
        })
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
