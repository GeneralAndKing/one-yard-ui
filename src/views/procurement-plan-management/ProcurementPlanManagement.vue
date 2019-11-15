<template lang="pug">
  v-container.one-procurement-mangement()
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
              v-tooltip(top, v-if="item.approvalStatus === '审批中' && item.planStatus === '提交审批'")
                template(v-slot:activator="{ on }")
                  v-btn.mr-2(outlined, rounded, x-small, fab, color="primary", v-on="on")
                    v-icon mdi-book-open-variant
                span 审批
              v-tooltip(top, v-if="item.approvalStatus === 'APPROVAL_ING' && item.planStatus === 'APPROVAL'")
                template(v-slot:activator="{ on }")
                  v-btn.mr-2(outlined, rounded, x-small, fab, color="warning", @click="handleRevoke(item)", v-on="on")
                    v-icon mdi-backup-restore
                span 撤回
              v-tooltip(top)
                template(v-slot:activator="{ on }")
                  v-btn.mr-2(outlined, rounded, x-small, fab, color="error", v-on="on" , @click="handleDelete(item)")
                    v-icon mdi-delete
                span 删除
          v-snackbar(v-model="revokeSnackbar", vertical, :timeout="0") 您确定撤回吗？
            v-row.justify-end
              v-btn.ma-3(color="error", text, @click="revokeSnackbar = false") 取消
              v-btn.ma-3(color="primary", text, @click="revokeOk") 确定
    procurement-plan(v-else, :see-id="see")
      v-btn(text, color='warning', @click="handleBack") 返回
</template>

<script>
import * as restAPI from '_api/rest'
import ProcurementPlan from '_c/procurement-plan'
import { planStatus, approvalStatus } from '_u/status'

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
    this.loading = true
    restAPI.getAll('procurementPlan').then(res => {
      this.desserts = res.data.content
      this.loading = false
    })
  },
  computed: {
    searchValue () {
      console.log(`${this.search.name}&${this.search.planStatus}&${this.search.approvalStatus}&${this.search.createTime}`)
      return `${this.search.name}&${this.search.planStatus}&${this.search.approvalStatus}&${this.search.createTime}`
    }
  },
  methods: {
    /**
     * 删除
     **/
    handleDelete (item) {
      // TODO：删除采购计划
      // restAPI.patchOne('procurementPlan', item.id, {
      //   planStatus: 'DELETED'
      // }).then(() => {
      //   this.$message('采购计划删除成功', 'success')
      //   item.planStatus = 'DELETED'
      // })
    },
    handleRevoke (item) {
      this.revokeSnackbar = true
    },
    revokeOk () {
      // TODO: 点击确定撤回后的事件
      this.revokeSnackbar = false
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
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
