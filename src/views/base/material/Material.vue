<template lang="pug">
  v-container#one-material
    v-card
      v-card-title 物料管理
      v-card-text
        v-skeleton-loader(:loading="load", type="table", transition="slide-y-transition")
          v-data-table(:headers="headers", :items="material", item-key="id", :loading="loading", :sort-by="['sort']"
            loading-text="正在加载数据", no-data-text="暂无数据", no-results-text="没有匹配的数据", :search="search")
            template(v-slot:item.materialTypeCode="{ item }")
              span {{item.materialType.code}}
            template(v-slot:item.materialTypeName="{ item }")
              span {{item.materialType.name}}
            template(v-slot:item.createTime="{ item }")
              span {{formatDate(item.createTime)}}
            template(v-slot:item.modifyTime="{ item }")
              span {{formatDate(item.modifyTime)}}
            template(v-slot:item.action="{ item }")
              v-tooltip(top)
                template(v-slot:activator="{ on }")
                  v-btn.mr-2(outlined, rounded, x-small, fab, color="info", v-on="on", @click="handleEdit(item)")
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
      v-dialog(v-model="dialog", max-width="800px", persistent)
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
                  v-flex(sm12, md6)
                    v-select(v-model="editedItem.materialType", label="物料类别", :items="materialType", @change="materialTypeSelect",
                      item-text="name", return-object, :rules="rules.unionRules(rules.requiredRules('物料类别'))")
                  v-flex(sm12, md6)
                    v-text-field(v-model="editedItem.name", label="物料名称",
                      :rules="rules.unionRules(rules.requiredRules('物料名称'),rules.maxLengthRules(18))")
                  v-flex(sm12, md6)
                    v-text-field(v-model="editedItem.code", label="物料编码", @blur="handleExistCode", ref="code",
                      :rules="rules.unionRules(rules.requiredRules('物料编码'),rules.maxLengthRules(18))")
                      template(v-slot:append)
                        v-progress-circular(v-if="loadCode", size="24", color="info", indeterminate)
                  v-flex(sm12, md6)
                    v-text-field(v-model="editedItem.specifications", label="规格", hint="当前物料规格",
                      :rules="rules.unionRules(rules.requiredRules('规格'))")
                  v-flex(xs12, md6)
                    v-text-field(v-model="editedItem.size", label="型号", hint="当前物料型号",
                      :rules="rules.unionRules(rules.requiredRules('型号'))")
                  v-flex(xs12, md6)
                    v-text-field(v-model="editedItem.unit", label="计量单位", hint="当前物料计量单位"
                      :rules="rules.unionRules(rules.requiredRules('计量单位'))",)
                  v-flex(sm12, md6)
                    v-text-field(v-model="editedItem.number", label="库存数量", hint="当前物料库存数量", type="number",
                      :rules="rules.unionRules(rules.requiredRules('库存数量'))")
                  v-flex(sm12, md6)
                    v-text-field(v-model="editedItem.lowNumber", label="最低库存", hint="当前物料最低库存", type="number",
                      :rules="rules.unionRules(rules.requiredRules('最低库存'))")
                  v-flex(sm12, md6)
                    v-text-field(v-model="editedItem.procurementLeadTime", label="物料采购提前期", hint="单位：天", type="number",
                      :rules="rules.unionRules(rules.requiredRules('物料采购提前期'))")
                  v-flex(sm12, md6)
                    v-text-field(v-model="editedItem.sort", label="排序", type="number",
                      :rules="rules.unionRules(rules.requiredRules('排序'))")
          v-card-actions.justify-end
            v-btn.mr-2(outlined, color="warning", @click="handleReset") 重置
            v-btn.mr-2(outlined, color="success", @click="handleSubmit") 提交
</template>

<script>
import * as restAPI from '_api/rest'
import * as RuleAPI from '_u/rule'
const material = 'material'
const materialType = 'materialType'
export default {
  name: 'Material',
  computed: {
    rules () {
      return RuleAPI
    }
  },
  data: () => ({
    loading: false,
    load: true,
    search: '',
    material: [],
    submitLoading: false,
    dialog: false,
    editedItem: {},
    editedIndex: -1,
    loadCode: false,
    materialType: [],
    headers: [
      { text: '物料名称', value: 'name', align: 'start' },
      { text: '物料编码', value: 'code', align: 'start' },
      { text: '物料分类编码', value: 'materialTypeCode', align: 'start' },
      { text: '物料分类名称', value: 'materialTypeName', align: 'start' },
      { text: '规格', value: 'specifications', align: 'start' },
      { text: '最低库存', value: 'lowNumber', align: 'start' },
      { text: '型号', value: 'size', align: 'start' },
      { text: '计量单位', value: 'unit', align: 'start' },
      { text: '库存数量', value: 'number', align: 'start' },
      { text: '采购提前期/天', value: 'procurementLeadTime', align: 'start' },
      { text: '排序', value: 'sort' },
      { text: '操作', value: 'action', sortable: false }
    ]
  }),
  async created () {
    this.loading = true
    try {
      this.initEdit()
      const types = await restAPI.getAll(materialType)
      this.materialType = types.data.content.filter(d => !d.hasOwnProperty('relTargetType'))
      const materials = await restAPI.getAll(material)
      this.material = materials.data.content.filter(d => !d.hasOwnProperty('relTargetType'))
      this.material.forEach(m => {
        m.materialType = this._.find(this.materialType, { id: m.typeId })
        if (typeof m.materialType === 'undefined') {
          m.materialType = {
            name: '已删除',
            code: '已删除'
          }
        }
      })
    } catch (e) {
      this.$message('数据初始化失败', 'error')
    } finally {
      this.loading = false
      this.load = false
    }
  },
  methods: {
    initEdit () {
      this.editedIndex = -1
      this.editedItem = {
        name: '',
        sort: '1',
        code: '',
        materialType: {},
        typeId: '',
        procurementLeadTime: 1,
        size: '',
        number: 1,
        unit: '',
        lowNumber: 1
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
      this.editedIndex = this._.indexOf(this.material, item)
      this.dialog = true
    },
    handleDelete (item) {
      this.loading = true
      restAPI.patchOne(material, item.id, { isEnable: false })
        .then(() => {
          this.material.splice(this.editedIndex, 1)
          this.$message('操作成功！', 'success')
        }).finally(() => { this.loading = false })
    },
    handleClose () {
      this.initEdit()
      this.dialog = false
      this.$refs.form.resetValidation()
    },
    handleReset () {
      this.editedItem = this._.cloneDeep(this.material[this.editedIndex])
    },
    handleSubmit () {
      if (!this.$refs.form.validate(true)) {
        return
      }
      this.submitLoading = true
      if (this.editedIndex === -1) {
        restAPI.addOne(material, this.editedItem)
          .then(res => {
            res.data.materialType = this._.find(this.materialType, { id: res.data.typeId })
            this.material.unshift(res.data)
            this.dialog = false
            this.$message('添加成功！', 'success')
            this.initEdit()
          }).finally(() => { this.submitLoading = false })
      } else {
        restAPI.patchOne(material, this.editedItem.id, this.editedItem)
          .then(res => {
            res.data.materialType = this._.find(this.materialType, { id: res.data.typeId })
            this.material.splice(this.editedIndex, 1, res.data)
            this.dialog = false
            this.$message('更新成功！', 'success')
            this.initEdit()
          }).finally(() => { this.submitLoading = false })
      }
    },
    materialTypeSelect () {
      this.editedItem.typeId = this.editedItem.materialType.id
    },
    handleExistCode () {
      restAPI.getRestLink(`material/search/existsByCode?code=${this.editedItem.code}`)
        .then(res => {
          if (res.data) this.$refs.code.errorBucket = ['物料编码已存在，请重新输入']
        }).finally(() => { this.loadCode = false })
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
