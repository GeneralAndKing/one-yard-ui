<template lang="pug">
  v-container.one-plan-mangement(v-if="see < 1")
    v-card
      v-slide-y-transition(mode="out-in")
        skeleton-loader(v-if="skeletonLoader")
        div(v-else)
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
                    v-select(v-model="search.approvalStatus", :items="approvalStatus", item-value='value', item-text='name', label="需求计划审批状态")
                  v-flex(xs12, md6, lg4)
                    v-menu(v-model="dayMenu", :close-on-content-click="false", transition="scale-transition",
                      offset-y, max-width="290px", min-width="290px")
                      template(v-slot:activator="{ on }")
                        v-text-field(v-model="search.createTime", v-on="on", label="需求日期", readonly)
                      v-date-picker(v-model="search.createTime", no-title, @input="dayMenu = false", locale="zh-cn")
                  v-flex.text-right(xs12, v-per="[Role.ROLE_PRODUCTION_SUPERVISOR,Role.ROLE_WORKSHOP_SUPERVISOR,Role.ROLE_WAREHOUSE_SUPERVISOR,Role.ROLE_FINANCE_SUPERVISOR]")
                    v-btn.mr-4(outlined, color="light-blue",
                      v-per="[Role.ROLE_PRODUCTION_PLANER,Role.ROLE_WORKSHOP_PLANER,Role.ROLE_WAREHOUSE_PLANER,Role.ROLE_FINANCE_PLANER]",
                      @click="initData()" ) 加载自己创建的需求计划
                    v-btn.mr-4(outlined, color="light-blue",
                      @click="seeApprovalIng()" ) (部门主管)查看待审批的需求计划
                    v-btn(outlined, color="light-blue",
                      @click="seeApprovalEd()" ) (部门主管)查看审批通过的需求计划
                  v-flex.text-right(xs12)
                    v-btn(outlined, color="warning", @click="seeReset") 重置条件
              v-data-table.mt-8(:headers="headers", :items="materialPlan", :loading="loading", loading-text="加载中......",
                item-key="id", :mobile-breakpoint="900",  :custom-filter="filterSearch", :search="searchValue",
                no-data-text="暂无数据", no-results-text="暂无数据")
                template(v-slot:item.planStatus="{ item }")
                  span {{ formatPlanStatus(item.planStatus).name }}
                template(v-slot:item.approvalStatus="{ item }")
                  span {{ formatApprovalStatus(item.approvalStatus).name }}
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
                  v-tooltip(top, v-if="item.planStatus === 'FREE'")
                    template(v-slot:activator="{ on }")
                      v-btn.mr-2(outlined, rounded, x-small, fab, color="success",
                        v-per="[Role.ROLE_PRODUCTION_PLANER,Role.ROLE_WORKSHOP_PLANER,Role.ROLE_WAREHOUSE_PLANER,Role.ROLE_FINANCE_PLANER]",
                        @click="handleSubmit(item)", v-on="on")
                        v-icon mdi-chevron-double-up
                    span 提交审批
                  v-tooltip(top, v-if="item.approvalStatus === 'APPROVAL_ING' && item.planStatus === 'APPROVAL'")
                    template(v-slot:activator="{ on }")
                      v-btn.mr-2(outlined, rounded, x-small, fab, color="info", v-if="approvalTag"
                        v-per="[Role.ROLE_PRODUCTION_SUPERVISOR,Role.ROLE_WORKSHOP_SUPERVISOR,Role.ROLE_WAREHOUSE_SUPERVISOR,Role.ROLE_FINANCE_SUPERVISOR]",
                        @click="handleApproval(item)", v-on="on")
                        v-icon mdi-book-open-variant
                    span 审批
                  v-tooltip(top, v-if="item.approvalStatus === 'APPROVAL_ING' && item.planStatus === 'APPROVAL'")
                    template(v-slot:activator="{ on }")
                      v-btn.mr-2(outlined, rounded, x-small, fab, color="error", v-if="backTag"
                        v-per="[Role.ROLE_PRODUCTION_PLANER,Role.ROLE_WORKSHOP_PLANER,Role.ROLE_WAREHOUSE_PLANER,Role.ROLE_FINANCE_PLANER]",
                        @click="handleRevoke(item)", v-on="on")
                        v-icon mdi-backup-restore
                    span 撤回
                  v-tooltip(top, v-if="item.planStatus === 'FREE'")
                    template(v-slot:activator="{ on }")
                      v-btn.mr-2(outlined, rounded, x-small, fab, color="error",
                        v-per="[Role.ROLE_PRODUCTION_PLANER,Role.ROLE_WORKSHOP_PLANER,Role.ROLE_WAREHOUSE_PLANER,Role.ROLE_FINANCE_PLANER]",
                        @click="handleDelete(item)", v-on="on")
                        v-icon mdi-delete
                    span 删除
              v-snackbar(v-model="revokeSnackbar", vertical, :timeout="0") 您确定撤回吗？
                v-row.justify-end
                  v-btn.ma-3(color="error", outlined, @click="revokeSnackbar = false") 取消
                  v-btn.ma-3(color="info", outlined, @click="revokeOk") 确定
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
                    v-btn(outlined, color="error", @click="handlePlanApproval('FREE', 'APPROVAL_NO', '审批退回')") 需求退回
                    v-btn(outlined, color="success", @click="handlePlanApproval('SUMMARY', 'APPROVAL_OK', '部门主管审批通过')") 需求通过
  material-plan(v-else, :see-id="see")
    v-btn(outlined, color="info", @click="handleBack") 返回
</template>

<script>
import { requiredRules, unionRules, requiredMessageRules } from '_u/rule'
import * as restAPI from '_api/rest'
import * as materialPlanAPI from '_api/materialPlan'
import MaterialPlan from '_c/material-plan'
import SkeletonLoader from '_c/skeleton-loader'
import { Role } from '_u/role'
import { planStatus, approvalStatus, planTypes } from '_u/status'

export default {
  name: 'MaterialPlanManagement',
  components: {
    MaterialPlan,
    SkeletonLoader
  },
  data: () => ({
    materialPlan: [],
    skeletonLoader: true,
    revokeSnackbar: false,
    dayMenu: false,
    see: 0,
    approvalTag: false,
    backTag: false,
    approval: {},
    search: {
      name: '',
      planType: '',
      needPeople: '',
      planStatus: '',
      approvalStatus: '',
      createTime: ''
    },
    planTypes: planTypes,
    planStatus: planStatus,
    approvalStatus: approvalStatus,
    approvalIng: false,
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
    },
    Role () {
      return Role
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
      let role = _this.$store.getters['auth/role']
      let resourcesLink = null
      this.search.planStatus = ''
      this.search.approvalStatus = ''
      if (Role.isSupervisor(role)) {
        this.approvalIng = true
        this.approvalTag = true
        this.backTag = false
        resourcesLink = `materialDemandPlan/search/byDepartmentIds?departmentIds=${Role.supervisorList(role)}`
      }
      if (Role.isPlaner(role)) {
        this.approvalIng = false
        this.approvalTag = false
        this.backTag = true
        resourcesLink = `materialDemandPlan/search/byCreateUser?createUser=${this.$store.getters['auth/username']}`
      }
      restAPI.getRestLink(resourcesLink)
        .then(res => {
          _this.materialPlan = res.data.content.filter(d => !d.hasOwnProperty('relTargetType'))
        })
        .finally(() => {
          this.loading = false
          this.skeletonLoader = false
        })
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
    handleSubmit (item) {
      this.loading = true
      restAPI.patchOne('materialDemandPlan', item.id, {
        approvalStatus: 'APPROVAL_ING',
        planStatus: 'APPROVAL'
      }).then(() => {
        this.loading = false
        item.approvalStatus = 'APPROVAL_ING'
        item.planStatus = 'APPROVAL'
        this.$message('操作成功！', 'success')
        this.materialPlan = []
        this.initData()
      })
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
        this.materialPlan = []
        this.initData()
      })
    },
    handleRevoke (item) {
      this.revoke = item
      this.revokeSnackbar = true
    },
    revokeOk () {
      materialPlanAPI.withdrawApproval(this.revoke.id)
        .then(() => {
          this.materialPlan = []
          this.initData()
          this.revokeSnackbar = false
          this.$message('撤回成功！', 'success')
        })
    },
    /**
     * 返回
     **/
    handleBack () {
      this.see = 0
      this.materialPlan = []
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
      if (this.approval.plan.planType === '紧急计划' && result === '部门主管审批通过') {
        this.approval.plan.planStatus = 'FINALLY'
      }
      materialPlanAPI.approvalMaterialPlan(this.approval.plan, this.approval)
        .then(() => {
          this.initData()
          this.approval.show = false
          this.$message('审批成功！', 'success')
          this.materialPlan = []
          this.initData()
        })
    },
    seeApprovalIng () {
      if (!this.approvalIng) {
        this.materialPlan = []
        let _this = this
        let role = _this.$store.getters['auth/role']
        let resourcesLink = null
        if (Role.isSupervisor(role)) {
          resourcesLink = `materialDemandPlan/search/byDepartmentIds?departmentIds=${Role.supervisorList(role)}`
        }
        restAPI.getRestLink(resourcesLink)
          .then(res => {
            _this.materialPlan = res.data.content.filter(d => !d.hasOwnProperty('relTargetType'))
            this.backTag = false
            this.approvalIng = true
          })
          .finally(() => { this.loading = false })
      }
      this.approvalTag = true
      this.search.planStatus = 'APPROVAL'
      this.search.approvalStatus = 'APPROVAL_ING'
    },
    seeApprovalEd () {
      if (!this.approvalIng) {
        this.seeApprovalIng()
      }
      this.approvalTag = false
      this.search.planStatus = ''
      this.search.approvalStatus = 'APPROVAL_OK'
    },
    seeReset () {
      this.search = {
        name: '',
        planType: '',
        needPeople: '',
        planStatus: '',
        approvalStatus: '',
        createTime: ''
      }
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
