<template lang="pug">
  v-container#one-material
    v-card
      v-card-title 物料类别管理
      v-card-text
        v-skeleton-loader(:loading="load", type="table", transition="slide-y-transition")
          v-data-table(:headers="headers", :items="materialType", item-key="id", :loading="loading", :sort-by="['sort']"
            loading-text="正在加载数据", no-data-text="暂无数据", no-results-text="没有匹配的数据", :search="search")
            template(v-slot:item.createTime="{ item }")
              span {{formatDate(item.createTime)}}
            template(v-slot:item.modifyTime="{ item }")
              span {{formatDate(item.modifyTime)}}
            template(v-slot:item.action="{ item }")
              v-tooltip(top)
                template(v-slot:activator="{ on }")
                  v-btn.mr-2(outlined, rounded, x-small, fab, color="primary", v-on="on", @click="handleEdit(item)")
                    v-icon mdi-pencil
                span 修改
              //v-tooltip(top)
                template(v-slot:activator="{ on }")
                  v-btn.mr-2(outlined, rounded, x-small, fab, color="error", v-on="on", @click="handleDelete(item)")
                    v-icon mdi-delete
                span 删除
            template(v-slot:top)
              v-toolbar(flat)
                v-spacer
                v-text-field(v-model="search", append-icon="search", label="输入名字查询", single-line, hide-details)
                v-btn.ml-4(outlined, color="success", @click="handleAdd") 添加
      v-dialog(v-model="dialog", max-width="400px", persistent)
        v-card(tile, :loading="submitLoading")
          v-card-title
            span.headline {{ editedIndex === -1 ? '添加' : '编辑' }}
            v-spacer
            v-btn(text, color="error", icon, @click="handleClose")
              v-icon mdi-close
          v-card-text
            v-container(grid-list-md)
              v-form(ref="form")
                v-layout(wrap, style="width:100%")
                  v-flex(sm12)
                    v-text-field(v-model="editedItem.name", label="物料类别名称",
                      :rules="rules.unionRules(rules.requiredRules('物料类别名称'),rules.maxLengthRules(18))")
                      template(v-slot:append)
                        v-progress-circular(v-if="loadCode", size="24", color="info", indeterminate)
                  v-flex(sm12)
                    v-text-field(v-model="editedItem.code", label="物料类别编码", @blur="handleExistCode", ref="code",
                      :rules="rules.unionRules(rules.requiredRules('物料类别编码'),rules.maxLengthRules(18))")
                  v-flex(sm12)
                    v-text-field(v-model="editedItem.sort", label="排序", type="number" :rules="rules.unionRules(rules.requiredRules('排序'))")
          v-card-actions.justify-end
            v-btn.mr-2(outlined, color="warning", @click="handleReset") 重置
            v-btn.mr-2(outlined, color="success", @click="handleSubmit") 提交
</template>

<script>
import * as restAPI from '_api/rest'
import * as RuleAPI from '_u/rule'
const materialType = 'materialType'
export default {
  name: 'MaterialType',
  computed: {
    rules () {
      return RuleAPI
    }
  },
  data: () => ({
    load: true,
    materialType: [],
    submitLoading: false,
    dialog: false,
    editedItem: {},
    editedIndex: -1,
    search: '',
    loadCode: false,
    loading: false,
    headers: [
      { text: '物料类别名称', value: 'name', align: 'start' },
      { text: '物料类别编码', value: 'code', align: 'start' },
      { text: '排序', value: 'sort' },
      { text: '创建时间', value: 'createTime' },
      { text: '创建用户', value: 'createUser' },
      { text: '修改时间', value: 'createTime' },
      { text: '修改用户', value: 'modifyUser' },
      { text: '操作', value: 'action', sortable: false }
    ]
  }),
  created () {
    this.loading = true
    this.initEdit()
    restAPI.getAll(materialType).then(res => {
      this.materialType = res.data.content.filter(d => !d.hasOwnProperty('relTargetType'))
      this.loading = false
      this.load = false
    })
  },
  methods: {
    initEdit () {
      this.editedIndex = -1
      this.editedItem = {
        name: '',
        sort: '1',
        code: ''
      }
    },
    formatDate (date) {
      if (!date) return ''
      return date.replace('T', ' ')
    },
    handleAdd () {
      this.initEdit()
      this.dialog = true
    },
    handleEdit (item) {
      this.editedItem = this._.cloneDeep(item)
      this.editedIndex = this._.indexOf(this.materialType, item)
      this.dialog = true
    },
    handleDelete (item) {
      this.loading = true
      restAPI.patchOne(materialType, item.id, { isEnable: false })
        .then(() => {
          this.materialType.splice(this.editedIndex, 1)
          this.$message('操作成功！', 'success')
        }).finally(() => { this.loading = false })
    },
    handleClose () {
      this.initEdit()
      this.dialog = false
    },
    handleReset () {
      this.editedItem = this._.cloneDeep(this.materialType[this.editedIndex])
    },
    handleSubmit () {
      if (!this.$refs.form.validate(true)) {
        return
      }
      this.submitLoading = true
      if (this.editedIndex === -1) {
        restAPI.addOne(materialType, this.editedItem)
          .then(res => {
            this.materialType.unshift(res.data)
            this.dialog = false
            this.$message('添加成功！', 'success')
            this.initEdit()
          }).finally(() => { this.submitLoading = false })
      } else {
        restAPI.patchOne(materialType, this.editedItem.id, {
          name: this.editedItem.name,
          sort: this.editedItem.sort,
          code: this.editedItem.code
        }).then(res => {
          this.materialType.splice(this.editedIndex, 1, res.data)
          this.dialog = false
          this.$message('更新成功！', 'success')
          this.initEdit()
        }).finally(() => { this.submitLoading = false })
      }
    },
    handleExistCode () {
      restAPI.getRestLink(`materialType/search/existsByCode?code=${this.editedItem.code}`)
        .then(res => {
          if (res.data) this.$refs.code.errorBucket = ['物料分类编码已存在，请重新输入']
        }).finally(() => { this.loadCode = false })
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
