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
                v-select(v-model="search.planStatus", :items="planStatus", label="需求计划状态")
              v-flex(sm12, md6, lg4)
                v-select(v-model="search.approvalStatus", :items="approvalStatus", label="审批状态")
              v-flex(xs12, md6, lg4)
                v-menu(v-model="dayMenu", :close-on-content-click="false", transition="scale-transition",
                  offset-y, max-width="290px", min-width="290px")
                  template(v-slot:activator="{ on }")
                    v-text-field(v-model="search.createTime", v-on="on", label="需求日期", readonly)
                  v-date-picker(v-model="search.createTime", no-title, @input="dayMenu = false", locale="zh-cn")
          v-data-table(:headers="headers", :items="materialPlan", :loading="loading", loading-text="加载中......",
            item-key="id", :mobile-breakpoint="900",  :custom-filter="filterSearch", :search="searchValue",
            no-data-text="暂无数据", no-results-text="暂无数据")
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
              v-tooltip(top)
                template(v-slot:activator="{ on }")
                  v-btn.mr-2(outlined, rounded, x-small, fab, color="primary", @click="handleApproval(item)", v-on="on")
                    v-icon mdi-book-open-variant
                span 审批
              v-tooltip(top)
                template(v-slot:activator="{ on }")
                  v-btn.mr-2(outlined, rounded, x-small, fab, color="error", @click="handleDelete(item)", v-on="on")
                    v-icon mdi-delete
                span 删除
          v-dialog(v-model="approval.show", max-width="350px")
            v-card
              v-card-title.headline
                span.title 计划审批
                v-spacer
                v-btn(text, color="error", icon, @click="initApproval")
                  v-icon mdi-close
              v-card-text
                v-textarea(v-model="approval.message", label="审批意见", hint="请输入您的审批意见", autofocus,
                  rows="5", auto-grow, counter)
              v-card-actions
                v-spacer
                v-btn(text, color="error") 不通过
                v-btn(text, color="success") 通过
  material-plan(v-else, :see-id="see")
    v-btn(text, color="primary", @click="handleBack") 返回
</template>

<script>
import * as restAPI from '_api/rest'
import MaterialPlan from '_c/material-plan'

export default {
  name: 'MaterialPlanManagement',
  components: {
    MaterialPlan
  },
  data: () => ({
    materialPlan: [],
    dayMenu: false,
    see: 0,
    approval: {
      show: false,
      message: null,
      item: null
    },
    search: {
      name: '',
      planType: '',
      needPeople: '',
      planStatus: '',
      approvalStatus: '',
      createTime: ''
    },
    planTypes: [ '', '订单型需求计划', '年度计划', '月度计划', '紧急计划' ],
    planStatus: [ '', '自由', '提交审批', '提交至汇总', '已删除', '已终止' ],
    approvalStatus: [ '', '未提交', '审批中', '审批通过', '审批退回' ],
    loading: false,
    headers: [
      { text: '编码', value: 'id' },
      { text: '名称', value: 'name' },
      { text: '计划类型', value: 'planType' },
      { text: '需求人员', value: 'needPeople' },
      { text: '计划状态', value: 'planStatus' },
      { text: '审批状态', value: 'approvalStatus' },
      { text: '创建时间', value: 'createTime' },
      { text: '操作', value: 'action', sortable: false, align: 'center' }
    ]
  }),
  computed: {
    searchValue () {
      return `${this.search.name}&${this.search.planType}&${this.search.needPeople}&${this.search.planStatus}&${this.search.approvalStatus}&${this.search.createTime}`
    }
  },
  created () {
    let _this = this
    this.loading = true
    restAPI.getAll('materialDemandPlan')
      .then(res => {
        res.data.content.forEach(p => {
          p.planStatus = _this.planStatusData(p.planStatus)
          p.approvalStatus = _this.approvalStatusData(p.planStatus)
          p.createTime = _this.dateFormat(p.createTime)
        })
        _this.materialPlan = res.data.content
      })
      .finally(() => { this.loading = false })
  },
  methods: {
    initApproval () {
      this.approval.show = false
      this.approval.message = null
      this.approval.item = null
    },
    planStatusData (data) {
      let msg = '自由'
      if (data === 'APPROVAL') msg = '提交审批'
      else if (data === 'SUMMARY') msg = '提交至汇总'
      else if (data === 'DELETED') msg = '已删除'
      else if (data === 'FINALLY') msg = '已终止'
      return msg
    },
    approvalStatusData (data) {
      let msg = '未提交'
      if (data === 'APPROVAL_ING') msg = '审批中'
      else if (data === 'APPROVAL_OK') msg = '审批通过'
      else if (data === 'APPROVAL_NO') msg = '审批退回'
      return msg
    },
    dateFormat (date) {
      return date.replace('T', '&nbsp;&nbsp;')
    },
    handleSee (item) {
      this.see = item.id
    },
    handleApproval (item) {
      this.approval.show = true
      this.approval.message = null
      this.approval.item = item
    },
    handleDelete (item) {
      //
    },
    handleBack () {
      this.see = 0
    },
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
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
