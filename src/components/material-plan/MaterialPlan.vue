<template lang="pug">
  v-container#one-plan-create
    more-btn(v-if="seeId > 0")
      v-btn(fab, small, color="green", dark, @click="print")
        v-icon mdi-printer-settings
    v-card
      v-card-title {{see?'计划表编辑':'计划表创建'}}
      v-card-text
        v-container(grid-list-md)
          v-form(ref="base")
            v-layout(wrap, style="width:100%")
              v-flex(sm12, md6, lg4)
                v-text-field(v-model="materialPlan.name", ref="name", label="需求计划名称", :disabled='see',
                  :rules="rules.union(rules.required('需求计划名称'),rules.maxLength(50))")
              v-flex(sm12, md6, lg4)
                v-select(v-model="materialPlan.planType", :items="planTypes", ref="planTypes", :disabled='see',
                  label="需求计划类型" :rules="rules.union(rules.required('需求计划类型'))")
              v-flex(sm12, md6, lg4)
                v-select(v-model="materialPlan.departmentId", :items="departments", ref="departmentId",  :disabled='see',
                  item-text="name", item-value="id", label="需求部门" :rules="rules.union(rules.required('需求部门'))")
              v-flex(sm12, md6, lg4)
                v-text-field(v-model="materialPlan.needPeople", ref="needPeople", label="需求人员",  :disabled='see',
                  :rules="rules.union(rules.required('需求人员'),rules.maxLength(18))")
              v-flex(xs12, md6, lg4, v-if="materialPlan.planType === '月度计划' || materialPlan.planType === '订单型需求计划'")
                v-menu(ref="month", :close-on-content-click="false", :return-value.sync="date", transition="scale-transition",
                  v-model="menu", max-width="290px", min-width="290px",)
                  template(v-slot:activator="{ on }")
                    v-text-field(v-model="materialPlan.month", label="需求月份", :disabled="see", v-on="on",
                      :rules="rules.union(rules.required('需求月份'))")
                  v-date-picker(v-model="date", type="month", no-title, scrollable, locale="zh-cn")
                    v-spacer
                    v-btn(text, color="primary",  @click="menu = false") 取消
                    v-btn(text, color="primary",  @click="$refs.month.save(date)") 选择
              v-flex(xs12, md6, lg4, v-if="materialPlan.planType === '年度计划'")
                v-select(v-model="materialPlan.month", :items="years", ref="month", :readonly='see', :disabled="see",
                  label="需求年份" :rules="rules.union(rules.required('需求年份'))")
              v-flex(sm12, md6, lg4)
                v-text-field(v-model="materialPlan.remark", label="备注", :disabled='see' :rules="rules.union(rules.maxLength(255))")
              v-flex(sm12, md6, lg4)
                v-switch(v-model="materialPlan.isBudgetPlan", :disabled='see')
                  template(v-slot:label)
                    span 是否预算内计划：
                    span(:class="materialPlan.isBudgetPlan? 'green--text' : 'red--text'") {{materialPlan.isBudgetPlan? '是' : '否'}}
        v-toolbar(flat, color="primary")
        v-tabs(v-model="tab", show-arrows)
          v-tab(:key="1")
            v-icon(left) mdi-account
            | 物料信息
          v-tab(:key="2")
            v-icon(left) mdi-account
            | 审批信息
          v-tab(:key="3")
            v-icon(left) mdi-account
            | 系统信息
          v-tabs-items.overflow-auto(v-model="tab")
            v-tab-item(:key="1")
              v-card(flat)
                v-card-text
                  v-data-table(v-model="selected", :headers="headers", :items="desserts", :loading="loading", no-data-text="暂无数据", no-results-text="暂无数据"
                    item-key="materialTrackingCode", :mobile-breakpoint="1200", show-select)
                    template(v-slot:item.materialCode="{ item }")
                      span {{item.material.code}}
                    template(v-slot:item.materialName="{ item }")
                      span {{item.material.name}}
                    template(v-slot:item.materialTypeCode="{ item }")
                      span {{item.materialType.code}}
                    template(v-slot:item.materialTypeName="{ item }")
                      span {{item.materialType.name}}
                    template(v-slot:item.specifications="{ item }")
                      span {{item.material.specifications}}
                    template(v-slot:item.size="{ item }")
                      span {{item.material.size}}
                    template(v-slot:item.unit="{ item }")
                      span {{item.material.unit}}
                    template(v-slot:item.isSourceGoods="{ item }")
                      span {{item.isSourceGoods?'是':'否'}}
                    template(v-slot:item.action="{ item }")
                      v-tooltip(top)
                        template(v-slot:activator="{ on }")
                          v-btn.mr-2(outlined, rounded, x-small, fab, color="error", @click="handleDelete(item)", v-on="on", :disabled="see")
                            v-icon mdi-delete
                        span 删除
                      v-tooltip(top)
                        template(v-slot:activator="{ on }")
                          v-btn.mr-2(outlined, rounded, x-small, fab, color="success", @click="handleEdit(item)", v-on="on", :disabled="see")
                            v-icon mdi-pencil
                        span 编辑
                      v-tooltip(top)
                        template(v-slot:activator="{ on }")
                          v-btn(outlined, rounded, x-small, fab, color="primary", @click="handleCopy(item)", v-on="on", :disabled="see")
                            v-icon file_copy
                        span 复制
                    template(v-slot:top)
                      v-toolbar(flat, justify-content="right")
                        h3.d-none 您的物料单
                        v-spacer
                        v-dialog(v-model="dialog", max-width="1200px", persistent)
                          template(v-slot:activator="{ on }")
                            v-btn.mb-2.ml-3.mr-3(text, color="primary", v-on="on", :disabled="see") 添加
                            v-btn.mb-2.ml-3.mr-3(text, color="error", @click="handleDeleteSelected", :disabled="see") 删除所选物料
                          v-card
                            v-card-title(primary-title)
                              .headline.lighten-2 添加数据
                              v-spacer
                              v-btn(icon,  @click="handleClose")
                                v-icon mdi-close
                            v-card-text
                              v-form(ref="add")
                                v-container(grid-list-md)
                                  v-layout(wrap)
                                    v-flex(xs12, md6, md4)
                                      v-select(v-model="editedItem.materialType", label="物料分类", :items="materialTypes", @change="materialTypeSelect",
                                        item-text="name", return-object, :rules="rules.union(rules.required('物料分类'))")
                                    v-flex(xs12, md6, md4)
                                      v-select(v-model="editedItem.material", label="物料", :items="materials", @change="materialSelect", item-text="name", return-object,
                                        :rules="rules.union(rules.required('物料'))", no-data-text="未选择物料分类或当前分类下无物料信息")
                                    v-flex(xs12, md6, md4)
                                      v-text-field(v-model="editedItem.specifications", label="规格", :rules="rules.union(rules.required('规格'))",
                                        readonly, hint="当前物料规格")
                                    v-flex(xs12, md6, md4)
                                      v-text-field(v-model="editedItem.size", label="型号", :rules="rules.union(rules.required('型号'))",
                                        readonly, hint="当前物料型号")
                                    v-flex(xs12, md6, md4)
                                      v-text-field(v-model="editedItem.unit", label="计量单位", :rules="rules.union(rules.required('计量单位'))",
                                        readonly, hint="当前物料计量单位")
                                    v-flex(xs12, md6, md4)
                                      v-text-field(v-model="editedItem.number", label="需求数量", type="number", :rules="rules.union(rules.requiredMessage('需求数量'),rules.maxLength(10))",
                                        hint="当前物料所需数量")
                                    v-flex(xs12, md6, md4)
                                      v-menu(v-model="dayMenu", :close-on-content-click="false", transition="scale-transition",
                                        offset-y, max-width="290px", min-width="290px")
                                        template(v-slot:activator="{ on }")
                                          v-text-field(v-model="editedItem.date", v-on="on", label="需求日期", readonly, :rules="rules.union(rules.required('需求日期'))")
                                        v-date-picker(v-model="needDate", no-title, @input="dayMenu = false", locale="zh-cn")
                                    v-flex(xs12, md6, md4)
                                      v-select(v-model="editedItem.expectationSupplier", label="期望供应商", :items="suppliers", item-text="name", item-value="name")
                                    v-flex(xs12, md6, md4)
                                      v-select(v-model="editedItem.fixedSupplier", label="固定供应商", :items="suppliers", item-text="name", item-value="name")
                                    v-flex(xs12, md6, md4)
                                      v-select(v-model="editedItem.inventory", label="需求库存组织", :items="inventory", item-text="name", item-value="name")
                                    v-flex(xs12, md6, md4)
                                      v-text-field(:value="editedItem.materialTrackingCode", label="物料追踪码", readonly, hint="此项为随机生成，请勿修改", persistent-hint)
                                    v-flex(xs12, md6, md4)
                                      v-switch(v-model="editedItem.isSourceGoods", :label="`货源是否, 确定:${editedItem.isSourceGoods ? '是': '否'}`")
                            v-card-actions
                              v-spacer
                              v-btn(text, color="error", @click="handleReset") 重置
                              v-btn(text, color="success", @click="handleAdd") {{editIndex < 0 ? '添加' : '保存修改'}}
            v-tab-item(:key="2")
              v-card(flat)
                v-card-text
                  v-data-table(:headers="approvalHeaders", :items="approvalDesserts", :loading="approvalLoading", no-data-text="暂无数据", no-results-text="暂无数据"
                    item-key="id", :mobile-breakpoint="900")
            v-tab-item(:key="3")
              v-card(flat)
                v-card-text
                  v-container(grid-list-md)
                    v-form(ref="system")
                      v-layout(wrap, style="width:100%")
                        v-flex(sm12, md6, lg4)
                          v-text-field(v-model="materialPlan.createUser", label="编制用户", disabled)
                        v-flex(sm12, md6, lg4)
                          v-text-field(v-model="materialPlan.createTime", label="编制时间", disabled)
                        v-flex(sm12, md6, lg4)
                          v-text-field(v-model="materialPlan.modifyUser", label="修改用户", disabled)
                        v-flex(sm12, md6, lg4)
                          v-text-field(v-model="materialPlan.modifyTime", label="修改时间", disabled)
                        v-flex(sm12, md6, lg4)
                          v-text-field(v-model="materialPlan.modifyTime", label="修改时间", disabled)
                        v-flex(sm12, md6, lg4)
                          v-text-field(v-model="materialPlan.modifyIdea", label="修改意见", :disabled="seeId === 0 || see")
      v-card-actions
        v-spacer
        slot
        v-btn(text, color="purple", @click="handleSave(false)", v-if="materialPlan.planStatus === 'FREE'") {{see? '编辑' : '保存'}}
        v-btn(v-if="!see", text, color="success", @click="handleSave(true)") 保存并提交审批
</template>

<script>
import { requiredRules, unionRules, requiredMessageRules, maxLengthRules } from '_u/rule'
import MoreBtn from '_c/more-btn/MoreBtn'
import { planTypesSelect } from '_u/status'
import * as materialPlanAPI from '_api/materialPlan'
import * as restAPI from '_api/rest'

const uuidv4 = require('uuid/v4')
export default {
  name: 'MaterialPlan',
  components: {
    MoreBtn
  },
  data: () => ({
    tab: 0,
    loading: false,
    approvalLoading: false,
    selected: [],
    menu: false,
    dayMenu: false,
    dialog: false,
    materialTypes: [],
    materials: [],
    materialItems: [],
    suppliers: [],
    inventory: [],
    see: false,
    years: [],
    rules: {
      required: requiredRules,
      requiredMessage: requiredMessageRules,
      union: unionRules,
      maxLength: maxLengthRules
    },
    date: new Date().toISOString().substr(0, 7),
    needDate: new Date().toISOString().substr(0, 10),
    planTypes: planTypesSelect,
    departments: [],
    editedItem: {},
    materialPlan: {
      materialType: null,
      material: null,
      name: null,
      planType: null,
      departmentId: null,
      modifyUser: null,
      modifyTime: null,
      createTime: null,
      createUser: null,
      modifyIdea: null,
      needPeople: null,
      planStatus: 'FREE',
      approvalStatus: 'NO_SUBMIT',
      isBudgetPlan: false,
      remark: null
    },
    desserts: [],
    editIndex: -1,
    headers: [
      { text: '物料编码', value: 'materialCode', align: 'center' },
      { text: '物料名称', value: 'materialName', align: 'center' },
      { text: '物料分类编码', value: 'materialTypeCode', align: 'center' },
      { text: '物料分类名称', value: 'materialTypeName', align: 'center' },
      { text: '规格', value: 'specifications', align: 'center' },
      { text: '型号', value: 'size', align: 'center' },
      { text: '计量单位', value: 'unit', align: 'center' },
      { text: '需求数量', value: 'number', align: 'center' },
      { text: '需求日期', value: 'date', align: 'center' },
      { text: '货源是否确定', value: 'isSourceGoods', align: 'center' },
      { text: '期望供应商', value: 'expectationSupplier', align: 'center' },
      { text: '固定供应商', value: 'fixedSupplier', align: 'center' },
      { text: '需求库存组织', value: 'inventory', align: 'center' },
      { value: 'isEnable', filter: value => value, sortable: false, width: '0px' },
      { text: '操作', value: 'action', sortable: false, width: '160px', align: 'center' }
    ],
    approvalHeaders: [
      { text: '审批意见', value: 'result' },
      { text: '说明', value: 'description', align: 'center' },
      { text: '审批时间', value: 'createTime', align: 'center' },
      { text: '审批用户', value: 'createUser', align: 'center' }
    ],
    approvalDesserts: []
  }),
  props: {
    seeId: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.initEdit()
    restAPI.getRestLink(`sysDepartment/search/byRoles?ids=${this.$store.getters['auth/role'].join(',')}`)
      .then(res => {
        this.departments = res.data.content.filter(d => d.name !== '暂无' && d.name !== '采购部')
      })
    restAPI.getAll('materialType').then(res => { this.materialTypes = res.data.content })
    restAPI.getAll('supplier').then(res => { this.suppliers = res.data.content })
    restAPI.getAll('inventory').then(res => { this.inventory = res.data.content })
    restAPI.getAll('material').then(res => { this.materialItems = res.data.content })
    this.years = Array.from({ length: 11 }, (a, i) => `${i + 2019}`)
    if (this.seeId !== 0) {
      this.see = true
      this.loading = true
      restAPI.getRestLink(`approval/search/byPlanIdAndApprovalType?approvalType=MATERIAL_APPROVAL&planId=${this.seeId}`)
        .then(res => { this.approvalDesserts = res.data.content.filter(d => !d.hasOwnProperty('relTargetType')) })
      materialPlanAPI.materialPlanById(this.seeId)
        .then(res => {
          this.materialPlan = res.data
          this.desserts = res.data.materials
        })
        .finally(() => { this.loading = false })
    }
  },
  watch: {
    date (val) {
      if (!val) return
      this.materialPlan.month = val.replace(/-/g, '')
    },
    needDate (val) {
      if (!val) return
      this.editedItem.date = val.replace(/-/g, '')
    }
  },
  methods: {
    initEdit () {
      this.editIndex = -1
      this.editedItem = {
        materialTypeId: null,
        materialId: null,
        materialType: null,
        material: null,
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
        isEnable: true,
        status: 'INIT',
        planSource: '物资需求'
      }
    },
    print () {
      this.$router.push({ name: 'print', params: { model: this.materialPlan, flag: 'materialPlan' } })
    },

    handleAdd () {
      if (!this.$refs.add.validate(true)) return
      this.editedItem.materialTypeId = this.editedItem.materialType.id
      this.editedItem.materialId = this.editedItem.material.id
      if (this.editIndex < 0) this.desserts.unshift(this._.cloneDeepWith(this.editedItem))
      else this.desserts.splice(this.editIndex, 1, this._.cloneDeepWith(this.editedItem))
      this.initEdit()
      this.dialog = false
      this.$refs.add.resetValidation()
    },
    handleDelete (item) {
      if (this.seeId !== 0) item.isEnable = false
      else this.desserts.splice(this._.indexOf(this.desserts, item), 1)
    },
    handleDeleteSelected () {
      if (this.selected.length <= 0) {
        this.$message('您没有选择任何数据', 'warning')
        return
      }
      this._.forEach(this.selected, value => { this.handleDelete(value) })
      this.selected = []
    },
    handleEdit (item) {
      this.editIndex = this._.indexOf(this.desserts, item)
      this.editedItem = this._.cloneDeepWith(item)
      this.editedItem.materialType = this._.find(this.materialTypes, { id: item.materialTypeId })
      this.materials = this.materialItems.filter(material => { return material.typeId === item.materialTypeId })
      this.editedItem.material = item.material
      this.editedItem.specifications = item.material.specifications
      this.editedItem.size = item.material.size
      this.editedItem.unit = item.material.unit
      this.dialog = true
    },
    handleCopy (item) {
      let copy = this._.cloneDeep(item)
      copy.materialTrackingCode = uuidv4()
      copy.id = null
      this.desserts.unshift(copy)
    },
    handleSave (submit) {
      if (!this.$refs.base.validate(true)) return
      if (this.see) {
        this.see = false
        return
      }
      if (submit) {
        this.materialPlan.approvalStatus = 'APPROVAL_ING'
        this.materialPlan.planStatus = 'APPROVAL'
      }
      materialPlanAPI.saveOrUpdate(this.materialPlan, this.desserts)
        .then(() => {
          this.$message('保存数据成功！', 'success')
          if (this.seeId <= 0) this.$router.push({ name: 'materialPlanManagement' })
          else this.see = true
        })
    },
    handleReset () {
      if (this.editIndex < 0) this.initEdit()
      else this.handleEdit(this.desserts[this.editIndex])
      this.$refs.add.resetValidation()
    },
    handleClose () {
      this.dialog = false
      this.editIndex = -1
      this.initEdit()
      this.$refs.add.resetValidation()
    },
    materialTypeSelect (item) {
      this.editedItem.material = null
      this.materials = this.materialItems.filter(material => { return material.typeId === item.id })
      this.editedItem.specifications = null
      this.editedItem.size = null
      this.editedItem.unit = null
      this.$refs.add.resetValidation()
    },
    materialSelect (item) {
      this.editedItem.specifications = item.specifications
      this.editedItem.size = item.size
      this.editedItem.unit = item.unit
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
