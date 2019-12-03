<template lang="pug">
  v-container#one-log.mt-9
    v-card
      v-card-text
        table-card-sheet(title="系统日志", description="您可以在这里查看当前系统访问情况等信息", color="info")
        approve-confirm(title="删除所选", ref="confirm", @submit="handleDelete", okText="确认", cancelText="取消")
          date-menu(v-model="date", label="选择日期")
        v-skeleton-loader(:loading="loading", type="table", transition="slide-y-transition")
          v-data-table(:headers="headers", :items="logs", item-key="id", :search="search")
            template(v-slot:item.name="{ item }")
              span.font-weight-black(:class="statusClass(item.name)") {{item.name}}
            template(v-slot:item.browser="{ item }")
              v-tooltip(top)
                template(v-slot:activator="{ on }")
                  span(v-on="on") {{formatData(item.browser)}}
                div {{item.browser}}
            template(v-slot:item.method="{ item }")
              span.font-weight-black(:class="methodClass(item.method)") {{item.method}}
            template(v-slot:item.args="{ item }")
              v-tooltip(top)
                template(v-slot:activator="{ on }")
                  span(v-on="on") {{formatData(item.args)}}
                div {{item.args}}
            template(v-slot:item.result="{ item }")
              v-tooltip(top)
                template(v-slot:activator="{ on }")
                  span(v-on="on") {{formatData(item.result)}}
                div {{item.result}}
            template(v-slot:item.createTime="{ item }")
              span {{formatDate(item.createTime)}}
            template(v-slot:top)
              v-toolbar(flat)
                v-text-field(
                  v-model="search",
                  append-icon="search",
                  label="请输入任意关键字搜索",
                  single-line,
                  hide-details
                )
                v-btn.ml-5(outlined, color="error", @click="$refs.confirm.dialog = true") 删除指定日期
</template>

<script>
import * as restAPI from '_api/rest'
import TableCardSheet from '_c/table-card-sheet'
import ApproveConfirm from '_c/approve-confirm'
import DateMenu from '_c/date-menu'

export default {
  name: 'SysLog',
  components: {
    TableCardSheet,
    ApproveConfirm,
    DateMenu
  },
  data: () => ({
    search: '',
    date: '',
    loading: true,
    logs: [],
    headers: [
      { text: '状态码', value: 'name' },
      { text: '请求链接', value: 'url' },
      { text: '来源地址', value: 'source' },
      { text: '浏览器', value: 'browser' },
      { text: '请求方法', value: 'method' },
      { text: '请求参数', value: 'args' },
      { text: '请求结果', value: 'result' },
      { text: '创建时间', value: 'createTime' },
      { text: '创建用户', value: 'createUser' }
    ]
  }),
  async created () {
    await this.initData()
  },
  methods: {
    async initData () {
      try {
        this.logs = []
        const res = await restAPI.getAll('sysLog')
        this.logs = res.data.content
      } finally {
        this.loading = false
      }
    },
    formatData (data) {
      if (!data) return ''
      return data.length > 15 ? `${data.substring(0, 15)}...` : data
    },
    methodClass (val) {
      if (val === 'GET') return 'success--text'
      else if (val === 'POST') return 'info--text'
      else if (val === 'PATCH') return 'warning--text'
      else return 'primary--text'
    },
    statusClass (val) {
      if (val >= 200 && val <= 300) return 'success--text'
      else if (val >= 400 && val < 500) return 'warning--text'
      else return 'error--text'
    },
    formatDate (date) {
      if (!date) return ''
      return date.replace('T', ' ')
    },
    handleDelete (flag) {
      if (!flag) return
      // "http://localhost:8080/api/rest/sysLog/search/deleteByCreateTime{?createTime}"
      restAPI.getRestLink(`sysLog/search/deleteByCreateTime?createTime=${this.date}`)
        .then((res) => {
          this.$message(`操作成功，操作总条数${res.data}`, 'success')
          this.loading = true
          this.initData()
        })
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
