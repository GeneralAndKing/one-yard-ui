<template lang="pug">
  v-container#one-plan-create
    v-speed-dial.mt-10(v-model="fab", top, right, fixed,
      transition='slide-y-reverse-transition', direction='bottom')
      template(v-slot:activator)
        v-btn(v-model="fab", color="blue darken-2", fab, dark)
          v-icon(v-if="fab") mdi-close
          v-icon(v-else) mdi-account-circle
      v-btn(fab, small, color="green", dark)
        v-icon mdi-pencil
      v-btn(fab, small, color="indigo", dark)
        v-icon mdi-plus
      v-btn(fab, small, color="red", dark)
        v-icon mdi-delete
    v-card
      v-card-title 创建计划表
      v-card-text
        v-container(grid-list-md)
          v-form(ref="base")
            v-layout(wrap, style="width:100%")
              v-flex(sm12, md6, lg4)
                v-select(v-model="materialPlan.planType", :items="planTypes", ref="planTypes",
                  label="需求计划类型" :rules="rules.union(rules.required('需求计划类型'))")
              v-flex(sm12, md6, lg4)
                v-select(v-model="materialPlan.departmentId", :items="departments", ref="departmentId",
                  item-text="name", item-value="id", label="需求部门" :rules="rules.union(rules.required('需求部门'))")
              v-flex(sm12, md6, lg4)
                v-text-field(v-model="materialPlan.name", ref="name", label="需求计划名称",
                  :rules="rules.union(rules.required('需求计划名称'))")
              v-flex(sm12, md6, lg4)
                v-text-field(v-model="materialPlan.needPeople", ref="needPeople", label="需求人员",
                  :rules="rules.union(rules.required('需求人员'))")
              v-flex(xs12, md6, lg4, v-if="materialPlan.planType === '月度计划'")
                v-menu(ref="month", :close-on-content-click="false", :return-value.sync="date", transition="scale-transition",
                  v-model="menu", max-width="290px", min-width="290px")
                  template(v-slot:activator="{ on }")
                    v-text-field(v-model="materialPlan.month", label="需求月份", readonly, v-on="on",
                      :rules="rules.union(rules.required('需求月份'))")
                  v-date-picker(v-model="date", type="month", no-title, scrollable, locale="zh-cn")
                    v-spacer
                    v-btn(text, color="primary",  @click="menu = false") 取消
                    v-btn(text, color="primary",  @click="$refs.month.save(date)") 选择
              v-flex(sm12, md6, lg4)
                v-text-field(v-model="materialPlan.remark", label="备注")
              v-flex(sm12, md6, lg4)
                v-switch(v-model="materialPlan.isBudgetPlan", :label="`是否预算内计划：${materialPlan.isBudgetPlan? '是' : '否'}`")
        v-data-table(v-model="selected", :headers="headers", :items="desserts",
          item-key="materialTrackingCode", :mobile-breakpoint="1200", show-select)
          template(v-slot:item.action="{ item }")
            v-tooltip(top)
              template(v-slot:activator="{ on }")
                v-btn.mr-2(outlined, rounded, x-small, fab, color="error", @click="handleDelete(item)", v-on="on")
                  v-icon mdi-delete
              span 删除
            v-tooltip(top)
              template(v-slot:activator="{ on }")
                v-btn.mr-2(outlined, rounded, x-small, fab, color="success", @click="handleEdit(item)", v-on="on")
                  v-icon mdi-pencil
              span 编辑
            v-tooltip(top)
              template(v-slot:activator="{ on }")
                v-btn(outlined, rounded, x-small, fab, color="primary", @click="handleCopy(item)", v-on="on")
                  v-icon file_copy
              span 复制
          template(v-slot:top)
            v-toolbar(flat, justify-content="right")
              h3 您的物料单
              v-spacer
              v-dialog(v-model="dialog", max-width="1200px", persistent)
                template(v-slot:activator="{ on }")
                  v-btn.mb-2.ml-3.mr-3(text, color="primary", v-on="on") 添加
                  v-btn.mb-2.ml-3.mr-3(text, color="error", @click="handleDeleteSelected") 删除所选
                v-card
                  v-card-title(primary-title)
                    .headline.lighten-2 添加数据
                    v-spacer
                    v-btn(icon,  @click="dialog = false")
                      v-icon mdi-close
                  v-card-text
                    v-form(ref="add")
                      v-container(grid-list-md)
                        v-layout(wrap)
                          v-flex(xs12, md6, md4)
                            v-select(v-model="editedItem.materialType", label="物料分类", :items="materialTypes",
                              item-text="name", return-object)
                          v-flex(xs12, md6, md4)
                            v-select(v-model="editedItem.material", label="物料", :items="materials",
                              item-text="name", return-object)
                          v-flex(xs12, md6, md4)
                            v-text-field(v-model="editedItem.specifications", label="规格")
                          v-flex(xs12, md6, md4)
                            v-text-field(v-model="editedItem.size", label="型号")
                          v-flex(xs12, md6, md4)
                            v-text-field(v-model="editedItem.unit", label="计量单位")
                          v-flex(xs12, md6, md4)
                            v-text-field(v-model="editedItem.number", label="需求数量", type="number")
                          v-flex(xs12, md6, md4)
                            v-menu(v-model="dayMenu", :close-on-content-click="false", transition="scale-transition",
                              offset-y, max-width="290px", min-width="290px")
                              template(v-slot:activator="{ on }")
                                v-text-field(v-model="editedItem.date", v-on="on", label="需求日期", readonly)
                              v-date-picker(v-model="editedItem.date", no-title, @input="dayMenu = false", locale="zh-cn")
                          v-flex(xs12, md6, md4)
                            v-text-field(v-model="editedItem.expectationSupplier", label="期望供应商")
                          v-flex(xs12, md6, md4)
                            v-text-field(v-model="editedItem.fixedSupplier", label="固定供应商")
                          v-flex(xs12, md6, md4)
                            v-text-field(v-model="editedItem.inventory", label="需求库存组织")
                          v-flex(xs12, md6, md4)
                            v-text-field(:value="editedItem.materialTrackingCode", label="物料追踪码", readonly, hint="此项为随机生成，请勿修改")
                          v-flex(xs12, md6, md4)
                            v-switch(v-model="editedItem.isSourceGoods", :label="`货源是否确定:${editedItem.isSourceGoods ? '是': '否'}`")
                  v-card-actions
                    v-spacer
                    v-btn(text, color="error", @click="initEdit") 重置
                    v-btn(text, color="success", @click="handleAdd") 添加
      v-card-actions
        v-spacer
        v-btn(text, color="purple", @click="handleSave") 保存
        v-btn(text, color="success", @click="handleSaveAndSubmit") 保存并提交
</template>

<script>
import { requiredRules, unionRules } from '_u/rules'
import * as materialPlanAPI from '_api/materialPlan'
import * as restAPI from '_api/rest'

const uuidv4 = require('uuid/v4')
export default {
  name: 'MaterialPlan',
  data: () => ({
    selected: [],
    menu: false,
    dayMenu: false,
    fab: false,
    dialog: false,
    materialTypes: [],
    materials: [],
    rules: {
      required: requiredRules,
      union: unionRules
    },
    date: new Date().toISOString().substr(0, 7),
    planTypes: [ '订单型需求计划', '年度计划', '月度计划', '紧急计划' ],
    departments: [],
    editedItem: {},
    materialPlan: {
      materialType: null,
      material: null,
      name: null,
      planType: null,
      departmentId: null,
      needPeople: null,
      planStatus: 'FREE',
      approvalStatus: 'NO_SUBMIT',
      isBudgetPlan: true,
      remark: null
    },
    desserts: [],
    headers: [
      { text: '物料分类编码', value: 'materialTypeCode' },
      { text: '物料分类名称', value: 'materialTypeName' },
      { text: '物料编码', value: 'materialCode' },
      { text: '物料名称', value: 'materialName' },
      { text: '规格', value: 'specifications' },
      { text: '型号', value: 'size' },
      { text: '计量单位', value: 'unit' },
      { text: '需求数量', value: 'number' },
      { text: '需求日期', value: 'date' },
      { text: '货源是否确定', value: 'isSourceGoods' },
      { text: '期望供应商', value: 'expectationSupplier' },
      { text: '固定供应商', value: 'fixedSupplier' },
      { text: '需求库存组织', value: 'inventory' },
      { text: '操作', value: 'action', sortable: false, width: '160px', align: 'center' }
    ]
  }),
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  created () {
    this.initEdit()
    restAPI.getAll('sysDepartment').then(res => { this.departments = res.data.content })
    restAPI.getAll('material').then(res => { this.materials = res.data.content })
    restAPI.getAll('materialType').then(res => { this.materialTypes = res.data.content })
  },
  watch: {
    date (val) {
      this.materialPlan.month = this.formatDate(val)
    }
  },
  methods: {
    initEdit () {
      this.editedItem = {
        materialTypeCode: null,
        materialTypeName: null,
        materialCode: null,
        materialName: null,
        specifications: null,
        size: null,
        unit: null,
        number: null,
        month: null,
        date: null,
        isSourceGoods: true,
        expectationSupplier: null,
        fixedSupplier: null,
        inventory: null,
        materialTrackingCode: uuidv4(),
        materialType: null,
        material: null
      }
    },
    handleAdd () {
      this.editedItem.materialTypeCode = this.editedItem.materialType.code
      this.editedItem.materialTypeName = this.editedItem.materialType.name
      this.editedItem.materialCode = this.editedItem.material.code
      this.editedItem.materialName = this.editedItem.material.name
      this.desserts.unshift(this._.cloneDeep(this.editedItem))
      this.initEdit()
      this.dialog = false
    },
    formatDate (date) {
      if (!date) return null
      const [year, month] = date.split('-')
      return `${year}${month}`
    },
    handleDelete (item) {
      this.desserts.splice(this._.indexOf(this.desserts, item), 1)
    },
    handleDeleteSelected () {
      if (this.selected.length <= 0) {
        this.$message('您没有选择任何数据', 'warning')
        return
      }
      this._.forEach(this.selected, value => {
        this.desserts.splice(this._.indexOf(this.desserts, value), 1)
        this.selected = []
      })
    },
    handleEdit (item) {
      console.log(item)
    },
    handleCopy (item) {
      let copy = this._.cloneDeep(item)
      copy.materialTrackingCode = uuidv4()
      this.desserts.unshift(copy)
    },
    handleSave () {
      if (!this.$refs.base.validate(true)) return
      materialPlanAPI.saveOrUpdate(this.materialPlan, this.desserts)
        .then(() => this.$message('保存数据成功！', 'success'))
    },
    handleSaveAndSubmit () {
      if (!this.$refs.base.validate(true)) return
      this.materialPlan.approvalStatus = 'APPROVAL_ING'
      this.materialPlan.planType = 'APPROVAL'
      materialPlanAPI.saveOrUpdate(this.materialPlan, this.desserts)
        .then(() => this.$message('保存数据并提交成功！', 'success'))
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
