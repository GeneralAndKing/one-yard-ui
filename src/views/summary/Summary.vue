<template lang="pug">
  v-container.one-summary
    more-btn
      v-btn(fab, small, color="green", dark, @click="print")
        v-icon mdi-printer-settings
    v-card
      v-card-title 物资供应方案
        v-container.mb-3(grid-list-md)
          v-form(ref="select")
            v-layout(wrap)
              v-flex(sm12, md6)
                v-select(ref="year", v-model="search.year", label="年度", :items="years", :rules="rules.union(rules.required('年度'))")
              v-flex(sm12, md6)
                v-select(ref="month", v-model="search.month", label="月度", :items="months", hint="当月度为 0 时将会查询当年年度计划",
                  persistent-hint, :rules="rules.union(rules.required('月度'))")
              v-flex.my-4.text-right(sm12)
                v-btn.mr-4(color="blue", outlined, @click="handleSelect") 查询
                v-btn.mr-4(color="success", outlined, @click="handleAdd", :disabled="desserts.length === 0") 添加
                v-btn.mr-4(color="orange", outlined, @click="handleAnd", :disabled="selected.length === 0") 合并所选
        v-data-table(v-model="selected", :headers="headers", :items="desserts", :loading="loading", loading-text="加载中......", style="width:100%",
          item-key="id", :mobile-breakpoint="800", no-data-text="暂无数据", no-results-text="暂无数据", show-select)
          template(v-slot:top)
            v-toolbar(flat)
              v-toolbar-title {{result.name}}
          template(v-slot:item.materialCode="{ item }")
            span {{item.material.code}}
          template(v-slot:item.materialName="{ item }")
            span {{item.material.name}}
          template(v-slot:item.materialTypeCode="{ item }")
            span {{item.materialType.code}}
          template(v-slot:item.materialTypeName="{ item }")
            span {{item.materialType.name}}
          template(v-slot:item.isSourceGoods="{ item }")
            span {{item.isSourceGoods?'是':'否'}}
          template(v-slot:item.action="{ item }")
            v-tooltip(top)
              template(v-slot:activator="{ on }")
                v-btn.mr-2(outlined, rounded, x-small, fab, color="primary", @click="handleEdit(item)", v-on="on")
                  v-icon mdi-pencil
              span 编辑
            v-tooltip(top)
              template(v-slot:activator="{ on }")
                v-btn.mr-2(outlined, rounded, x-small, fab, color="warning", @click="handleBack(item)", v-on="on")
                  v-icon mdi-arrow-collapse-left
              span 需求退回
            v-tooltip(top, v-if="!item.id")
              template(v-slot:activator="{ on }")
                v-btn.mr-2(outlined, rounded, x-small, fab, color="error", @click="handleDelete(item)", v-on="on")
                  v-icon mdi-delete
              span 删除
            v-tooltip(top, v-if="item.id")
              template(v-slot:activator="{ on }")
                v-btn.mr-2(outlined, rounded, x-small, fab, color="error", @click="handleSplit(item)", v-on="on")
                  v-icon mdi-cash-multiple
              span 拆分
        v-dialog(v-model="dialog", max-width="1200px", persistent)
          v-card
            v-card-title(primary-title)
              .headline.lighten-2 {{edit ? '编辑数据' : '添加数据'}}
              v-spacer
              v-btn(icon,  @click="handleClose")
                v-icon mdi-close
            v-card-text
              v-form(ref="edit")
                v-container(grid-list-md)
                  v-layout(wrap, v-if="edit")
                    v-flex(xs12, md6, md4)
                      v-text-field(v-model="editedItem.material.code", label="物料编码", disabled)
                    v-flex(xs12, md6, md4)
                      v-text-field(v-model="editedItem.material.name", label="物料名称", disabled)
                    v-flex(xs12, md6, md4)
                      v-text-field(v-model="editedItem.materialType.code", label="物料分类编码", disabled)
                    v-flex(xs12, md6, md4)
                      v-text-field(v-model="editedItem.materialType.name", label="物料分类名称", disabled)
                    v-flex(xs12, md6, md4)
                      v-select(v-model="editedItem.supplyMode", label="供应方式", :rules="rules.union(rules.requiredMessage('供应方式'))",
                        hint="供应方式", :items="supplyMode", )
                    v-flex(xs12, md6, md4, v-if="editedItem.supplyMode === '采购'")
                      v-text-field(v-model="editedItem.supplyNumber", label="供应数量", type="number", :rules="rules.union(rules.requiredMessage('供应数量'))",
                        hint="当前物料供应数量", )
                    v-flex(xs12, md6, md4, v-if="editedItem.supplyMode === '采购'")
                      v-menu(v-model="purchaseMenu", :close-on-content-click="false", transition="scale-transition",
                        offset-y, max-width="290px", min-width="290px")
                        template(v-slot:activator="{ on }")
                          v-text-field(v-model="editedItem.purchaseDate", v-on="on", label="采购日期", readonly,
                            :rules="rules.union(rules.required('采购日期'))", )
                        v-date-picker(v-model="purchaseDate", no-title, @input="purchaseMenu = false", locale="zh-cn")
                    v-flex(xs12, md6)
                      v-text-field(v-model="editedItem.material.lowNumber", label="最低库存", disabled)
                    v-flex(xs12, md6)
                      v-text-field(v-model="editedItem.material.specifications", label="规格", disabled)
                    v-flex(xs12, md6)
                      v-text-field(v-model="editedItem.material.size", label="型号", disabled)
                    v-flex(xs12, md6)
                      v-text-field(v-model="editedItem.material.unit", label="单位", disabled)
                    v-flex(xs12, md6)
                      v-text-field(v-model="editedItem.material.lowNumber", label="最低库存", disabled)
                    v-flex(xs12, md6)
                      v-text-field(v-model="editedItem.number", label="需求数量", disabled)
                    v-flex(xs12, md6)
                      v-text-field(v-model="editedItem.inTransitNum", label="在途数量", readonly, disabled)
                    v-flex(xs12, md6)
                      v-text-field(v-model="editedItem.availableNum", label="可用库存", readonly, disabled)
                    v-flex(xs12, md6)
                      v-text-field(v-model="editedItem.occupiedNum", label="已占库存", readonly, disabled)
                    v-flex(xs12, md6)
                      v-text-field(v-model="editedItem.date", label="需求日期", disabled)
                    v-flex(xs12, md6)
                      v-text-field(:value="editedItem.isSourceGoods? '是': '否'", label="货源是否确定", disabled)
                    v-flex(xs12, md6)
                      v-text-field(v-model="editedItem.expectationSupplier", label="期望供应商", disabled)
                    v-flex(xs12, md6)
                      v-text-field(v-model="editedItem.fixedSupplier", label="固定供应商", disabled)
                    v-flex(xs12, md6)
                      v-text-field(v-model="editedItem.inventory", label="需求库存组织", disabled)
                  v-layout(wrap, v-if="!edit")
                    v-flex(xs12, md6)
                      v-select(v-model="editedItem.materialType", label="物料分类", :items="materialTypes", @change="materialTypeSelect",
                        item-text="name", return-object, :rules="rules.union(rules.required('物料分类'))")
                    v-flex(xs12, md6)
                      v-select(v-model="editedItem.material", label="物料", :items="materials", item-text="name",
                        return-object, :rules="rules.union(rules.required('物料'))", no-data-text="未选择物料分类或当前分类下无物料信息")
                    v-flex(xs12, md6)
                      v-select(v-model="editedItem.supplyMode", label="供应方式", :rules="rules.union(rules.requiredMessage('供应方式'))",
                        hint="供应方式", :items="supplyMode")
                    v-flex(xs12, md6)
                      v-text-field(v-model="editedItem.number", label="供应数量", type="number", :rules="rules.union(rules.requiredMessage('供应数量'))",
                        hint="值为需求数量，不可修改", readonly)
                    v-flex(xs12, md6, v-if="editedItem.supplyMode === '采购'")
                      v-menu(v-model="purchaseMenu", :close-on-content-click="false", transition="scale-transition",
                        offset-y, max-width="290px", min-width="290px")
                        template(v-slot:activator="{ on }")
                          v-text-field(v-model="editedItem.purchaseDate", v-on="on", label="采购日期", readonly,
                            :rules="rules.union(rules.required('采购日期'))")
                        v-date-picker(v-model="purchaseDate", no-title, @input="purchaseMenu = false", locale="zh-cn")
                    v-flex(xs12, md6)
                      v-text-field(v-model="editedItem.material.lowNumber", label="最低库存", :rules="rules.union(rules.required('最低库存'))", readonly)
                    v-flex(xs12, md6)
                      v-text-field(v-model="editedItem.material.specifications", label="规格", :rules="rules.union(rules.required('规格'))",
                        readonly, hint="当前物料规格")
                    v-flex(xs12, md6)
                      v-text-field(v-model="editedItem.material.size", label="型号", :rules="rules.union(rules.required('型号'))",
                        readonly, hint="当前物料型号")
                    v-flex(xs12, md6)
                      v-text-field(v-model="editedItem.material.unit", label="计量单位", :rules="rules.union(rules.required('计量单位'))",
                        readonly, hint="当前物料计量单位")
                    v-flex(xs12, md6)
                      v-text-field(v-model="editedItem.material.number", label="需求数量", type="number", :rules="rules.union(rules.requiredMessage('需求数量'))",
                        hint="当前物料所需数量")
                    v-flex(xs12, md6)
                      v-menu(v-model="dayMenu", :close-on-content-click="false", transition="scale-transition",
                        offset-y, max-width="290px", min-width="290px")
                        template(v-slot:activator="{ on }")
                          v-text-field(v-model="editedItem.date", v-on="on", label="需求日期", readonly,
                            :rules="rules.union(rules.required('需求日期'))")
                        v-date-picker(v-model="needDate", no-title, @input="dayMenu = false", locale="zh-cn")
                    v-flex(xs12, md6)
                      v-select(v-model="editedItem.expectationSupplier", label="期望供应商", :items="suppliers",
                        item-text="name", item-value="name")
                    v-flex(xs12, md6)
                      v-select(v-model="editedItem.fixedSupplier", label="固定供应商", :items="suppliers",
                        item-text="name", item-value="name")
                    v-flex(xs12, md6)
                      v-select(v-model="editedItem.inventory", label="需求库存组织", :items="inventory",
                        item-text="name", item-value="name")
                    v-flex(xs12, md6)
                      v-text-field(:value="editedItem.materialTrackingCode", label="物料追踪码", readonly,
                        hint="此项为随机生成，请勿修改", persistent-hint)
                    v-flex(xs12, md6)
                      v-switch(v-model="editedItem.isSourceGoods", :label="`货源是否确定:${editedItem.isSourceGoods ? '是': '否'}`")
            v-card-actions
              v-spacer
              v-btn(outlined, color="error", @click="handleReset") 重置
              v-btn(outlined, color="success", @click="handleSave") {{edit ? '保存修改' : '添加'}}
        v-dialog(v-model="submitDialog", max-width="400px", persistent)
          v-card(tile, loading="submitLoading")
            v-card-title.pa-0
              v-toolbar(flat, dark, color="primary")
                v-toolbar-title 生成采购计划
                v-spacer
                v-btn(icon, dark, @click="submitDialog = false")
                  v-icon mdi-close
            v-card-text.pt-4
              p 您当前的计划类型为：
                strong.success--text {{searchValue.endsWith('00') ? '年度计划' : '月度计划' }}
              v-text-field(v-model="purchaseName", label="采购计划名称", hint="请输入您的采购计划名称", persistent-hint,
                :rules="rules.union(rules.requiredMessage('名称'))", ref="purchaseName")
            v-card-actions
              v-spacer
              v-btn(color="success", outlined, @click="handleSubmitOk") 生成
        v-dialog(v-model="splitDialog", fullscreen, hide-overlay, transition="dialog-bottom-transition", scrollable)
          v-card(tile)
            v-card-title.pa-0
              v-toolbar(flat, dark, color="primary")
                v-toolbar-title 拆分数据
                v-spacer
                v-btn(icon, dark, @click="splitDialog = false")
                  v-icon mdi-close
            v-card-text
              v-expansion-panels.mt-2
                v-expansion-panel
                  v-expansion-panel-header 查看拆分规则
                  v-expansion-panel-content
                    p 1. 拆分物料的需求总数量
                      strong.primary--text 不能超过
                      | 当前物料的需求数量
                    p 2. 拆分物料的基础信息（物料类别等信息）与原来一致
                      strong.primary--text 不可修改
                    p 3. 表格中的所有字段均
                      strong.primary--text 必填！
                      strong.success--text 点击相应单元格即可编辑
                    p 4. 点击保存修改后，将会
                      strong.primary--text 立即生效
              v-layout.mt-4(wrap)
                v-flex(xs12, md6, lg4)
                  v-text-field(v-model="editedItem.material.code", label="物料编码", disabled)
                v-flex(xs12, md6, lg4)
                  v-text-field(v-model="editedItem.material.name", label="物料名称", disabled)
                v-flex(xs12, md6, lg4)
                  v-text-field(v-model="editedItem.materialType.code", label="物料分类编码", disabled)
                v-flex(xs12, md6, lg4)
                  v-text-field(v-model="editedItem.materialType.name", label="物料分类名称", disabled)
                v-flex(xs12, md6, lg4)
                  v-text-field(v-model="editedItem.material.lowNumber", label="最低库存", disabled)
                v-flex(xs12, md6, lg4)
                  v-text-field(v-model="editedItem.material.specifications", label="规格", disabled)
                v-flex(xs12, md6, lg4)
                  v-text-field(v-model="editedItem.material.size", label="型号", disabled)
                v-flex(xs12, md6, lg4)
                  v-text-field(v-model="editedItem.material.unit", label="单位", disabled)
                v-flex(xs12, md6, lg4)
                  v-text-field(v-model="editedItem.number", label="需求数量", disabled, persistent-hint, hint="拆分数量之和不能超过此值")
                v-flex(xs12, md6, lg4)
                  v-text-field(v-model="editedItem.inTransitNum", label="在途数量", readonly, disabled)
                v-flex(xs12, md6, lg4)
                  v-text-field(v-model="editedItem.availableNum", label="可用库存", readonly, disabled)
                v-flex(xs12, md6, lg4)
                  v-text-field(v-model="editedItem.occupiedNum", label="已占库存", readonly, disabled)
                v-flex.text-right(xs12)
                  v-btn(outlined, color="primary", @click="handleSplitData") 拆分数据
              v-data-table(:headers="splitHeaders", :items="splitItems", item-key="id", hide-default-footer, no-data-text="暂无数据")
                template(v-slot:item.number="props")
                  v-edit-dialog(:return-value.sync="props.item.number", persistent, large, save-text="确定", cancel-text="取消") {{ props.item.number }}
                    template(v-slot:input)
                      v-text-field(v-model="props.item.number", type="number", label="需求数量", single-line)
                template(v-slot:item.fixedSupplier="props")
                  v-edit-dialog(:return-value.sync="props.item.fixedSupplier", large, persistent, save-text="确定", cancel-text="取消")
                    | {{ props.item.fixedSupplier }}
                    template(v-slot:input)
                      v-select(v-model="props.item.fixedSupplier", label="固定供应商", single-line, :items="suppliers",
                        item-text="name", item-value="name")
                template(v-slot:item.expectationSupplier="props")
                  v-edit-dialog(:return-value.sync="props.item.expectationSupplier", large, persistent, save-text="确定", cancel-text="取消")
                    | {{ props.item.expectationSupplier }}
                    template(v-slot:input)
                      v-select(v-model="props.item.expectationSupplier", label="期望供应商", single-line, :items="suppliers",
                        item-text="name", item-value="name")
                template(v-slot:item.supplyMode="props")
                  v-edit-dialog(:return-value.sync="props.item.supplyMode", large, persistent, save-text="确定", cancel-text="取消")
                    | {{ props.item.supplyMode }}
                    template(v-slot:input)
                      v-select(v-model="props.item.supplyMode", label="供应方式", single-line, :items="supplyMode")
                template(v-slot:item.date="props")
                  v-edit-dialog(:return-value.sync="props.item.date", large, persistent, save-text="确定", cancel-text="取消")
                    | {{ props.item.date }}
                    template(v-slot:input)
                      v-menu(v-model="purchaseMenu", :close-on-content-click="false", transition="scale-transition",
                        offset-y, max-width="290px", min-width="290px")
                        template(v-slot:activator="{ on }")
                          v-text-field(v-model="props.item.date", v-on="on", label="采购日期", readonly,
                            :rules="rules.union(rules.required('采购日期'))")
                        v-date-picker(v-model="props.item.date", no-title, @input="purchaseMenu = false", locale="zh-cn")
                template(v-slot:item.action="{ item }")
                  v-tooltip(top)
                    template(v-slot:activator="{ on }")
                      v-btn.mr-2(outlined, rounded, x-small, fab, color="error",
                        @click="(item) => {splitItems.splice(splitItems.indexOf(item), 1)}", v-on="on")
                        v-icon mdi-delete
                    span 删除
            v-card-actions
              v-spacer
              v-btn(outlined, color="success", @click="handleSplitSave") 保存拆分数据
      v-snackbar(v-model="revokeSnackbar", vertical, :timeout="0") 您确定退回此需求吗？
        v-row.justify-end
          v-btn.ma-3(color="error", text, @click="revokeSnackbar = false") 取消
          v-btn.ma-3(color="primary", text, @click="revokeOk") 确定
      v-card-actions
        v-spacer
        v-btn(outlined, color="success", @click="handleSubmit", :disabled="desserts.length === 0") 保存并生成采购计划

</template>

<script>
import * as restAPI from '_api/rest'
import * as procurementPlan from '_api/procurementPlan'
import MoreBtn from '_c/more-btn/MoreBtn'
import { requiredRules, unionRules, requiredMessageRules } from '_u/rule'
const uuidv4 = require('uuid/v4')

export default {
  name: 'Summary',
  components: {
    MoreBtn
  },
  data: () => ({
    selected: [],
    splitDialog: false,
    submitLoading: false,
    purchaseName: '',
    revokeSnackbar: false,
    revokeItem: {},
    submitDialog: false,
    purchaseMenu: false,
    needDate: new Date().toISOString().substr(0, 10),
    purchaseDate: new Date().toISOString().substr(0, 10),
    dayMenu: false,
    dialog: false,
    search: {
      year: '',
      month: ''
    },
    result: {
      name: '汇总表'
    },
    loading: false,
    years: [],
    months: [],
    editedIndex: -1,
    editedItem: {},
    desserts: [],
    materialTypes: [],
    materials: [],
    edit: false,
    inventory: [],
    materialItems: [],
    suppliers: [],
    seeOne: true,
    supplyMode: ['库存供应', '采购'],
    summary: [],
    splitItems: [],
    splitHeaders: [
      { text: '需求数量', value: 'number' },
      { text: '固定供应商', value: 'fixedSupplier' },
      { text: '期望供应商', value: 'expectationSupplier' },
      { text: '供应方式', value: 'supplyMode' },
      { text: '采购日期', value: 'date' },
      { text: '操作', value: 'action', sortable: false, width: '160px', align: 'center' }
    ],
    headers: [
      { text: '物料编码', value: 'materialCode', align: 'center' },
      { text: '物料名称', value: 'materialName', align: 'center' },
      { text: '物料分类编码', value: 'materialTypeCode', align: 'center' },
      { text: '物料分类名称', value: 'materialTypeName', align: 'center' },
      { text: '需求部门', value: 'departmentName', align: 'center' },
      { text: '需求数量', value: 'number', align: 'center' },
      { text: '需求日期', value: 'date', align: 'center' },
      { text: '货源是否确定', value: 'isSourceGoods', align: 'center' },
      { text: '供应方式', value: 'supplyMode', align: 'center' },
      { text: '操作', value: 'action', sortable: false, width: '160px', align: 'center' }
    ],
    rules: {
      union: unionRules,
      required: requiredRules,
      requiredMessage: requiredMessageRules
    }
  }),
  created () {
    restAPI.getAll('materialType').then(res => { this.materialTypes = res.data.content })
    restAPI.getAll('supplier').then(res => { this.suppliers = res.data.content })
    restAPI.getAll('inventory').then(res => { this.inventory = res.data.content })
    restAPI.getAll('material').then(res => { this.materialItems = res.data.content })
    this.years = Array.from({ length: 11 }, (a, i) => `${i + 2019}`)
    this.months = Array.from({ length: 13 }, (a, i) => `${i}`)
    restAPI.getAll('materialPlanSummary').then(res => {
      this.summary = res.data.content
    })
    this.initEditedItem()
  },
  computed: {
    searchValue () {
      if (this.search.year === '' || this.search.month === '' ||
        typeof (this.search.year) === 'undefined' ||
        typeof (this.search.month) === 'undefined') return ''
      let month = ''
      if (this.search.month.length === 1) month = `0${this.search.month}`
      return `${this.search.year}${month}`
    }
  },
  watch: {
    needDate (val) {
      if (!val) return
      this.editedItem.date = val.replace(/-/g, '')
    },
    purchaseDate (val) {
      if (!val) return
      this.editedItem.purchaseDate = val.replace(/-/g, '')
    },
    editedIndex (val) {
      this.edit = val !== -1
    }
  },
  methods: {
    initEditedItem () {
      this.editedIndex = -1
      this.editedItem = {
        date: '',
        expectationSupplier: null,
        fixedSupplier: null,
        inventory: null,
        isEnable: true,
        isSourceGoods: true,
        material: Object,
        materialId: 1,
        materialTrackingCode: uuidv4(),
        materialType: Object,
        materialTypeId: 1,
        name: null,
        number: 50,
        planId: null,
        procurementPlanId: null,
        purchaseDate: null,
        remark: null,
        status: 'INIT',
        supplyMode: null,
        supplyNumber: null
      }
    },
    handleSelect () {
      if (!this.$refs.select.validate()) return
      const result = this.summary.find(s => this.searchValue.includes(s.sort))
      if (typeof (result) === 'undefined') {
        this.$message('暂无此汇总表', 'warning')
        this.result = { name: '' }
        this.desserts = []
        return
      }
      this.result = result
      this.loading = true
      restAPI.getLink(`materialPlanSummary/getMaterialPlanSummary/${result.id}`)
        .then(res => {
          this.desserts = res.data.planMaterials
          console.log(this.desserts)
        })
        .finally(() => { this.loading = false })
    },
    handleAdd () {
      this.initEditedItem()
      this.dialog = true
    },
    handleEdit (item) {
      this.editedItem = this._.cloneDeep(item)
      this.editedIndex = this.desserts.indexOf(item)
      this.dialog = true
    },
    handleBack (item) {
      this.revokeItem = this._.cloneDeep(item)
      this.revokeSnackbar = true
    },
    revokeOk () {
      // TODO: 退回
      // this.revokeItem 退原数据
      // revokeSnackbar 退回提示框显示
    },
    handleSplit (item) {
      // TODO：数据拆分
      this.editedItem = this._.cloneDeep(item)
      this.splitDialog = true
    },
    handleSplitData () {
      this.splitItems.unshift({
        number: 0,
        fixedSupplier: '无',
        expectationSupplier: '无',
        supplyMode: '采购',
        date: '2019-11-11'
      })
    },
    handleSplitSave () {
      //
    },
    materialTypeSelect (item) {
      this.editedItem.material = {}
      this.materials = this.materialItems.filter(material => { return material.typeId === item.id })
      this.$refs.edit.resetValidation()
    },
    handleClose () {
      this.dialog = false
      this.$refs.edit.resetValidation()
    },
    handleReset () {
      if (this.edit) this.editedItem = this._.cloneDeep(this.desserts[this.editedIndex])
      else this.initEditedItem()
      this.$refs.edit.resetValidation()
    },
    handleSave () {
      if (!this.$refs.edit.validate()) return
      this.editedItem.materialId = this.editedItem.material.id
      this.editedItem.materialTypeId = this.editedItem.materialType.id
      this.editedItem.supplyNumber = this.editedItem.number
      if (this.edit) this.desserts.splice(this.editedIndex, 1, this.editedItem)
      else this.desserts.unshift(this.editedItem)
      this.initEditedItem()
      this.handleClose()
    },
    handleSubmit () {
      // 供应方式，供应数量，采购日期
      for (const d in this.desserts) {
        if (this.checkNUll(this.desserts[d].supplyMode)) {
          this.$message(`请确认所有的数据都已经填写供应方式`, 'warning')
          return
        } else if (this.checkNUll(this.desserts[d].supplyNumber)) {
          this.$message(`请确认所有的数据都已经填写供应数量`, 'warning')
          return
        }
        if (this.desserts[d].supplyMode === this.supplyMode[1]) {
          if (this.checkNUll(this.desserts[d].purchaseDate)) {
            this.$message(`请确认所有供应方式为采购的数据都已经填写采购日期`, 'warning')
            return
          }
        }
      }
      this.submitDialog = true
    },
    checkNUll (str) {
      return typeof (str) === 'undefined' || str === null || str === ''
    },
    handleDelete (item) {
      this.desserts.splice(this.desserts.indexOf(item), 1)
    },
    handleSubmitOk () {
      if (!this.$refs.purchaseName.validate(true)) return
      this.submitLoading = true
      let purchase = {
        name: this.purchaseName,
        planType: this.searchValue.endsWith('00') ? '年度采购计划' : '月度采购计划',
        approvalStatus: 'NO_SUBMIT',
        planStatus: 'FREE'
      }
      procurementPlan.saveOrUpdate(purchase, this.desserts)
        .then(() => {
          this.submitDialog = false
          this.$router.push({ name: 'procurementPlanManagement' })
        }).finally(() => { this.submitLoading = true })
    },
    handleAnd () {
      // TODO：合并数据
      console.log(this.selected)
    },
    print () {
      if (this.desserts.length < 1) {
        this.$message('没有数据可以打印哦～')
        return
      }
      this.$router.push({
        name: 'print',
        params: {
          model: this.searchValue,
          desserts: this.desserts,
          flag: 'summary'
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
