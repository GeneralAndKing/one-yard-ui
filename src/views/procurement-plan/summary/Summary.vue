<template lang="pug">
  v-container.one-summary
    more-btn
      v-btn(fab, small, color="green", dark, @click="print")
        v-icon mdi-printer-settings
    v-card
      v-slide-y-transition(mode="out-in")
        skeleton-loader(v-if="skeletonLoader", :md="6", :lg="6", :num="2")
        div(v-else)
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
                    // 合并规则 菜单栏------------------------A 开始
                    v-menu(bottom, offset-y, :close-on-content-click="false")
                      template(v-slot:activator="{ on }")
                        v-btn.mr-4(color="blue accent-4", outlined, v-on="on") 合并规则
                      v-list(dense)
                        v-list-item
                          v-switch(v-model="mergeRule.material", label="物料", disabled, dense, hide-details)
                        v-list-item
                          v-switch(v-model="mergeRule.expectationSupplier", label="期望供应商", dense, hide-details)
                        v-list-item
                          v-switch(v-model="mergeRule.fixedSupplier", label="固定供应商", dense, hide-details)
                        v-list-item.mb-3
                          v-switch(v-model="mergeRule.date", label="需求日期", dense, hide-details)
                    // -------------------------------------A 结束
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
                    v-btn.mr-2(outlined, rounded, x-small, fab, color="info", @click="handleEdit(item)", v-on="on")
                      v-icon mdi-pencil
                  span 编辑
                v-tooltip(top, v-if='item.planId !== null')
                  template(v-slot:activator="{ on }")
                    v-btn.mr-2(outlined, rounded, x-small, fab, color="warning", @click="handleBack(item)", v-on="on")
                      v-icon mdi-arrow-collapse-left
                  span 需求退回
                v-tooltip(top, v-if="!item.id")
                  template(v-slot:activator="{ on }")
                    v-btn.mr-2(outlined, rounded, x-small, fab, color="error", @click="handleDelete(item)", v-on="on")
                      v-icon mdi-delete
                  span 删除
                v-tooltip(top, v-if="item.id !== null")
                  template(v-slot:activator="{ on }")
                    v-btn.mr-2(outlined, rounded, x-small, fab, color="error", @click="handleSplit(item)", v-on="on")
                      v-icon mdi-cash-multiple
                  span 拆分
            // 点击 添加 和 编辑 按钮后弹出的模态框 -------------- A 开始
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
                      // 当点击的是 编辑 的时候，显示这部分 ------------ B开始
                      v-layout(wrap, v-if="edit")
                        v-flex(xs12, md6, lg3, v-if="editedItem.planId")
                          v-text-field(v-model="editedItem.planId", label="计划编号", disabled)
                        v-flex(xs12, md6, lg3)
                          v-text-field(v-model="editedItem.material.code", label="物料编码", disabled)
                        v-flex(xs12, md6, lg3)
                          v-text-field(v-model="editedItem.material.name", label="物料名称", disabled)
                        v-flex(xs12, md6, lg3)
                          v-text-field(v-model="editedItem.materialType.code", label="物料分类编码", disabled)
                        v-flex(xs12, md6, lg3)
                          v-text-field(v-model="editedItem.materialType.name", label="物料分类名称", disabled)
                        v-flex(xs12, md6, lg3)
                          v-text-field(v-model="editedItem.material.lowNumber", label="最低库存", disabled)
                        v-flex(xs12, md6, lg3)
                          v-text-field(v-model="editedItem.material.specifications", label="规格", disabled)
                        v-flex(xs12, md6, lg3)
                          v-text-field(v-model="editedItem.material.size", label="型号", disabled)
                        v-flex(xs12, md6, lg3)
                          v-text-field(v-model="editedItem.material.unit", label="单位", disabled)
                        v-flex(xs12, md6, lg3)
                          v-text-field(v-model="editedItem.number", label="需求数量", disabled)
                        v-flex(xs12, md6, lg3)
                          v-text-field(v-model="editedItem.inTransitNum", label="在途数量", readonly, disabled)
                        v-flex(xs12, md6, lg3)
                          v-text-field(v-model="editedItem.availableNum", label="可用库存", readonly, disabled)
                        v-flex(xs12, md6, lg3)
                          v-text-field(v-model="editedItem.occupiedNum", label="已占库存", readonly, disabled)
                        v-flex(xs12, md6, lg3)
                          v-text-field(v-model="editedItem.date", label="需求日期", disabled)
                        v-flex(xs12, md6, lg3)
                          v-text-field(:value="editedItem.isSourceGoods? '是': '否'", label="货源是否确定", disabled)
                        v-flex(xs12, md6, lg3)
                          v-text-field(v-model="editedItem.expectationSupplier", label="期望供应商", disabled)
                        v-flex(xs12, md6, lg3)
                          v-text-field(v-model="editedItem.fixedSupplier", label="固定供应商", disabled)
                        v-flex(xs12, md6, lg3)
                          v-text-field(v-model="editedItem.inventory", label="需求库存组织", disabled)
                        v-flex(xs12, md6, lg3)
                          v-select(v-model="editedItem.supplyMode", label="供应方式", :rules="rules.union(rules.requiredMessage('供应方式'))",
                            hint="供应方式", :items="supplyMode", ref="supplyMode" )
                        v-flex(xs12, md6, lg3, v-if="editedItem.supplyMode === '采购'")
                          v-menu(v-model="purchaseMenu", :close-on-content-click="false", transition="scale-transition",
                            offset-y, max-width="290px", min-width="290px")
                            template(v-slot:activator="{ on }")
                              v-text-field(v-model="editedItem.purchaseDate", v-on="on", label="采购日期", readonly,
                                :rules="rules.union(rules.required('采购日期'))", ref="purchaseDate")
                            v-date-picker(v-model="purchaseDate", no-title, @input="purchaseMenu = false", locale="zh-cn")
                      // --------------------------------- B结束
                      // 当点击的是 添加 的时候，显示这部分 ---------------- B 开始
                      v-layout(wrap, v-if="!edit")
                        v-flex(xs12, md6, lg3)
                          v-select(v-model="editedItem.materialType", label="物料分类", :items="materialTypes", @change="materialTypeSelect",
                            item-text="name", return-object, :rules="rules.union(rules.required('物料分类'))")
                        v-flex(xs12, md6, lg3)
                          v-select(v-model="editedItem.material", label="物料", :items="materials", item-text="name",
                            return-object, :rules="rules.union(rules.required('物料'))", no-data-text="未选择物料分类或当前分类下无物料信息")
                        v-flex(xs12, md6, lg3)
                          v-text-field(v-model="editedItem.material.lowNumber", label="最低库存", :rules="rules.union(rules.required('最低库存'))", readonly)
                        v-flex(xs12, md6, lg3)
                          v-text-field(v-model="editedItem.material.specifications", label="规格", :rules="rules.union(rules.required('规格'))",
                            readonly, hint="当前物料规格")
                        v-flex(xs12, md6, lg3)
                          v-text-field(v-model="editedItem.material.size", label="型号", :rules="rules.union(rules.required('型号'))",
                            readonly, hint="当前物料型号")
                        v-flex(xs12, md6, lg3)
                          v-text-field(v-model="editedItem.material.unit", label="计量单位", :rules="rules.union(rules.required('计量单位'))",
                            readonly, hint="当前物料计量单位")
                        v-flex(xs12, md6, lg3)
                          v-text-field(v-model="editedItem.number", label="需求数量", type="number", :rules="rules.union(rules.requiredMessage('需求数量'))",
                            hint="当前物料所需数量")
                        v-flex(xs12, md6, lg3)
                          v-menu(v-model="dayMenu", :close-on-content-click="false", transition="scale-transition",
                            offset-y, max-width="290px", min-width="290px")
                            template(v-slot:activator="{ on }")
                              v-text-field(v-model="editedItem.date", v-on="on", label="需求日期", readonly,
                                :rules="rules.union(rules.required('需求日期'))")
                            v-date-picker(v-model="needDate", no-title, @input="dayMenu = false", locale="zh-cn")
                        v-flex(xs12, md6, lg3)
                          v-select(v-model="editedItem.expectationSupplier", label="期望供应商", :items="suppliers",
                            item-text="name", item-value="name")
                        v-flex(xs12, md6, lg3)
                          v-select(v-model="editedItem.fixedSupplier", label="固定供应商", :items="suppliers",
                            item-text="name", item-value="name")
                        v-flex(xs12, md6, lg3)
                          v-select(v-model="editedItem.inventory", label="需求库存组织", :items="inventory",
                            item-text="name", item-value="name")
                        v-flex(xs12, md6, lg3)
                          v-text-field(:value="editedItem.materialTrackingCode", label="物料追踪码", readonly,
                            hint="此项为随机生成，请勿修改", persistent-hint disabled)
                        v-flex(xs12, md6, lg3, v-if="editedItem.id !== null")
                          v-select(v-model="editedItem.supplyMode", label="供应方式", :rules="rules.union(rules.requiredMessage('供应方式'))",
                            hint="供应方式", :items="supplyMode")
                        v-flex(xs12, md6, lg3, v-if="editedItem.id === null")
                          v-text-field(v-model="editedItem.supplyMode", label="供应方式", readonly,
                            hint="采购部新增物资只允许采购")
                        v-flex(xs12, md6, lg3, v-if="editedItem.supplyMode === '库存供应'")
                          v-text-field(v-model="editedItem.supplyNumber", label="供应数量", type="number", :rules="rules.union(rules.requiredMessage('供应数量'))",
                            hint="填写库存供应数量，若为达到需求数量则自动拆分" )
                        v-flex(xs12, md6, lg3, v-if="editedItem.supplyMode === '采购'")
                          v-text-field(label="采购数量", hint="当前物料采购数量") 采购数量与需求数量保持一致
                        v-flex(xs12, md6, lg3, v-if="editedItem.supplyMode === '采购'")
                          v-menu(v-model="purchaseMenu", :close-on-content-click="false", transition="scale-transition",
                            offset-y, max-width="290px", min-width="290px")
                            template(v-slot:activator="{ on }")
                              v-text-field(v-model="editedItem.purchaseDate", v-on="on", label="采购日期", readonly,
                                :rules="rules.union(rules.required('采购日期'))" ref="purchaseDate")
                            v-date-picker(v-model="purchaseDate", no-title, @input="purchaseMenu = false", locale="zh-cn")
                        v-flex(xs12, md6, lg3)
                          v-switch(v-model="editedItem.isSourceGoods", :label="`货源是否确定:${editedItem.isSourceGoods ? '是': '否'}`")
                      // --------------------------------------- B 结束
                v-card-actions
                  v-spacer
                  v-btn(outlined, color="error", @click="handleReset") 重置
                  v-btn(outlined, color="success", @click="handleSave") {{edit ? '保存修改' : '添加'}}
              // ----------------------------------  A 结束
          // 点击 保存并生成采购计划 时弹出的模态框 ---------------- C 开始
          v-dialog(v-model="submitDialog", max-width="400px", persistent)
            v-card(tile, :loading="submitLoading")
              v-card-title.pa-0
                v-toolbar(flat, dark, color="info")
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
          // -------------------------------------------------------- C 结束
          // 点击 需求退回 的时候弹出的模态框 -------------------------- D 开始
          v-dialog(v-model="returnDialog", max-width="500px", persistent)
            v-card(tile)
              v-card-title.pa-0
                v-toolbar(flat, dark, color="info")
                  v-toolbar-title 需求退回
                  v-spacer
                  v-btn(icon, dark, @click="handleCloseReturn")
                    v-icon mdi-close
              v-card-text
                v-radio-group(v-model="returnMethod")
                  template(v-slot:label)
                    div 请选择您的需求退回方式：
                  v-radio(:value="true")
                    template(v-slot:label)
                      div 退回
                        strong.success--text 物资所在需求计划
                  v-radio(:value="false")
                    template(v-slot:label)
                      div 退回
                        strong.primary--text 当前需求物资
                v-textarea(v-model="returnDescription", label="审批意见", hint="请输入您的审批意见", :rules="rules.union(rules.required('审批意见'))",
                  rows="5", ref='description', auto-grow, counter)
                br
                strong 注意：此操作会立即生效且不可逆，请谨慎操作！
              v-card-actions
                v-spacer
                v-btn(outlined, color="success", @click="revokeOk") 确认退回
          // --------------------------------------------------- D 结束
          // 点击 拆分 按钮的时候弹出的模态框 --------------------------- E 开始
          v-dialog(v-model="splitDialog", hide-overlay, transition="scale-transition", scrollable)
            v-card(tile)
              v-card-title.pa-0
                v-toolbar(flat, dark, color="info")
                  v-toolbar-title 拆分数据
                  v-spacer
                  v-btn(icon, dark, @click="splitDialog = false")
                    v-icon mdi-close
              v-card-text
                v-expansion-panels.mt-2
                  v-expansion-panel
                    v-expansion-panel-header 查看拆分规则
                    v-expansion-panel-content
                      p 1. 拆分物料为两条，如果需要请
                        strong.primary--text 多次拆分
                      p 2. 拆分物料的基础信息（物料类别等信息）与原来一致
                        strong.primary--text 不可修改
                      p 3. 拆分后的物料供应方式需要
                        strong.primary--text 重新填写
                      p 4. 拆分完成后，本条数据会完全被标识为
                        strong.primary--text 已拆分
                      p 5. 点击拆分数据后，将会
                        strong.primary--text 立即生效
                      p 6. 拆分后的物料
                        strong.primary--text 不能退回
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
                    v-text-field(v-model="editedItem.number", label="需求数量", disabled)
                  v-flex(xs12, md6, lg4)
                    v-text-field(v-model="editedItem.date", label="需求日期", disabled)
                  v-flex(xs12, md6, lg4)
                    v-text-field(v-model="editedItem.inTransitNum", label="在途数量", readonly, disabled)
                  v-flex(xs12, md6, lg4)
                    v-text-field(v-model="editedItem.availableNum", label="可用库存", readonly, disabled)
                  v-flex(xs12, md6, lg4)
                    v-text-field(v-model="editedItem.occupiedNum", label="已占库存", readonly, disabled)
                  v-flex.text-right(xs12)
                    v-btn(outlined, color="info", @click="handleSplitSave") 拆分数据
                  v-flex
                    v-slider(
                      v-model="editedItem.newNumber"
                      :max="editedItem.number-1"
                      :min="1"
                      track-color="red"
                      thumb-label="always")
                      template(v-slot:prepend)
                        v-text-field(:value="editedItem.newNumber" type="number" label="拆分物料(1)" disabled)
                      template(v-slot:append)
                        v-text-field(type="number" label="拆分物料(2)" disabled :value="editedItem.number-editedItem.newNumber")
          // ------------------------------------ E 结束
          // 点击 退回需求 的时候弹出的 提示条 ------------------ F 开始
          v-snackbar(v-model="revokeSnackbar", vertical, :timeout="0") 您确定退回此需求吗？
            v-row.justify-end
              v-btn.ma-3(color="error", outlined, @click="revokeSnackbar = false") 取消
              v-btn.ma-3(color="info", outlined, @click="revokeOk") 确定
          // -------------------------------------------------- F 结束
          v-card-actions
            v-spacer
            v-btn(outlined, color="success", @click="handleSubmit", :disabled="desserts.length === 0") 保存并生成采购计划

</template>

<script>
import * as restAPI from '_api/rest'
import * as procurementPlan from '_api/procurementPlan'
import * as planMaterialAPI from '_api/planMaterial'
import MoreBtn from '_c/more-btn'
import { requiredRules, unionRules, requiredMessageRules } from '_u/rule'
import SkeletonLoader from '_c/skeleton-loader/SkeletonLoader'
const uuidv4 = require('uuid/v4')

export default {
  name: 'Summary',
  components: {
    SkeletonLoader,
    MoreBtn
  },
  data: () => ({
    skeletonLoader: true,
    splitPurchaseMenu: false,
    selected: [],
    splitDialog: false,
    submitLoading: false,
    purchaseName: '',
    revokeSnackbar: false,
    revokeItem: {},
    submitDialog: false,
    returnDialog: false,
    returnMethod: true,
    returnDescription: '',
    returnItem: {},
    approval: {},
    purchaseMenu: false,
    needDate: new Date().toISOString().substr(0, 10),
    purchaseDate: new Date().toISOString().substr(0, 10),
    dayMenu: false,
    dialog: false,
    mergeRule: {
      material: true,
      expectationSupplier: false,
      fixedSupplier: false,
      date: false
    },
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
      this.skeletonLoader = false
    })
    this.initEditedItem()
    this.initApproval()
  },
  computed: {
    searchValue () {
      if (this.search.year === '' || this.search.month === '' ||
        typeof (this.search.year) === 'undefined' ||
        typeof (this.search.month) === 'undefined') return ''
      let month = ''
      if (this.search.month.length === 1) month = `0${this.search.month}`
      else month = `${this.search.month}`
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
        id: null,
        expectationSupplier: null,
        fixedSupplier: null,
        inventory: null,
        isEnable: true,
        isSourceGoods: true,
        material: {},
        materialId: 1,
        materialTrackingCode: uuidv4(),
        materialType: {},
        materialTypeId: 1,
        name: null,
        number: 0,
        planId: null,
        procurementPlanId: null,
        purchaseDate: null,
        remark: null,
        status: 'INIT',
        supplyMode: '采购',
        supplyNumber: null
      }
    },
    initApproval () {
      this.approval = {
        description: '',
        result: null,
        approvalType: '',
        planId: -1
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
          this.desserts.forEach(pm => {
            if (pm.departmentName === null && pm.remark !== null) pm.departmentName = pm.remark
          })
        })
        .finally(() => { this.loading = false })
    },
    handleAdd () {
      this.initEditedItem()
      this.editedItem.supplyMode = '采购'
      this.dialog = true
    },
    handleEdit (item) {
      this.editedItem = this._.cloneDeep(item)
      if (this.editedItem.supplyMode === '采购') {
        this.editedItem.supplyNumber = this.editedItem.number
      }
      this.editedIndex = this.desserts.indexOf(item)
      this.dialog = true
    },
    handleBack (item) {
      this.returnDialog = true
      this.returnItem = this._.cloneDeep(item)
    },
    handleCloseReturn () {
      this.returnDialog = false
      this.returnItem = {}
      this.returnDescription = ''
    },
    revokeOk () {
      // this.returnItem 是退回的那一行数据
      // this.returnMethod 是退回的方法，true：整个计划，false：当前物资
      // this.returnDescription 是审批意见
      // this.returnDialog 是提示框，true 为显示，false 是不显示
      // 校验输入框
      if (!this.$refs.description.validate(true)) return
      this.approval.description = this.returnDescription
      planMaterialAPI.backPlanOrMaterial(this.returnItem, this.approval, this.returnMethod)
        .then(() => {
          // 删除那一行数据
          this.desserts.splice(this._.indexOf(this.desserts, this.returnItem), 1)
          // 关闭并重置
          this.handleCloseReturn()
          this.$message('退回成功！', 'success')
          this.initApproval()
        }
        )
    },
    handleSplit (item) {
      this.initEditedItem()
      this.editedItem = this._.cloneDeep(item)
      this.editedItem.newNumber = 1
      this.editedIndex = this._.indexOf(this.desserts, item)
      this.splitItems = []
      this.splitDialog = true
    },
    handleSplitSave () {
      if (this.editedItem.newNumber <= 0 || this.editedItem.number - this.editedItem.newNumber <= 0) {
        this.$message('拆分失败,物料数量小于0', 'error')
        return
      }
      let leftNum = this.editedItem.newNumber
      let rightNum = this.editedItem.number - leftNum
      delete this.editedItem.newNumber
      let leftItem = this._.cloneDeep(this.editedItem)
      let rightItem = this._.cloneDeep(this.editedItem)
      leftItem.number = leftNum
      leftItem.id = null
      leftItem.purchaseDate = null
      leftItem.supplyMode = null
      leftItem.supplyNumber = null
      leftItem.planId = null
      leftItem.remark = this.editedItem.departmentName
      leftItem.materialTrackingCode = uuidv4()
      rightItem.number = rightNum
      rightItem.purchaseDate = null
      rightItem.supplyMode = null
      rightItem.id = null
      rightItem.materialTrackingCode = uuidv4()
      rightItem.planId = null
      rightItem.remark = this.editedItem.departmentName
      rightItem.supplyNumber = null
      planMaterialAPI.splitMaterialPlan(this.editedItem, [leftItem, rightItem]).then(res => {
        let planMaterials = res.data
        this.desserts.splice(this.editedIndex, 1)
        for (let i = 1; i < planMaterials.length; i++) {
          this.desserts.unshift(planMaterials[i])
        }
        this.$message('拆分成功', 'success')
        this.splitDialog = false
      })
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
      this.editedItem.supplyNumber = this.editedItem.number
      if (this.editedItem.supplyMode !== '采购') {
        if (this.editedItem.availableNum - this.editedItem.supplyNumber < 0) {
          this.$refs.supplyMode.errorBucket = ['供应数量大于可用库存,请拆分后进行操作']
          return
        }
        let sumNumber = this.desserts.reduce((total, value) => {
          if (typeof total !== 'number') {
            total = 0
          }
          if ((value.materialId === this.editedItem.materialId && value.supplyMode === '库存供应' && value.supplyNumber !== null) || value.materialTrackingCode === this.editedItem.materialTrackingCode) {
            return total + value.number
          } else {
            return total
          }
        })
        if (sumNumber > this.editedItem.availableNum) {
          this.$refs.supplyMode.errorBucket = ['相同物料超出可用库存,请拆分后进行操作']
          return
        }
      } else {
        if (this.editedItem.date < this.editedItem.purchaseDate) {
          this.$refs.purchaseDate.errorBucket = ['采购日期不能晚于需求日期']
          return
        }
      }
      this.editedItem.materialId = this.editedItem.material.id
      this.editedItem.materialTypeId = this.editedItem.materialType.id

      if (this.edit) this.desserts.splice(this.editedIndex, 1, this.editedItem)
      else this.desserts.unshift(this.editedItem)
      this.initEditedItem()
      this.handleClose()
    },
    handleSubmit () {
      // 供应方式，供应数量，采购日期
      if (this.selected.length < 1) {
        this.$message('数据少于1条,不能生成采购计划', 'error')
        this.selected = []
        return
      }
      let date = new Date()
      const key = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`
      for (const d in this.selected) {
        if (this.checkNUll(this.selected[d].supplyMode)) {
          this.$message(`选中的第` + (parseInt(d) + 1) + `条数据未填写供应方式`, 'warning')
          this.selected = []
          return
        } else if (this.checkNUll(this.selected[d].supplyNumber)) {
          this.$message(`选中的第` + (parseInt(d) + 1) + `条数据未填写供应数量`, 'warning')
          this.selected = []
          return
        } else if (this.selected[d].supplyNumber > this.selected[d].number) {
          this.$message(`选中的第` + (parseInt(d) + 1) + `条数据供应数量超过了需求数量，请重新输入`, 'warning')
          this.selected = []
          return
        }
        if (this.selected[d].supplyMode === this.supplyMode[1]) {
          if (this.checkNUll(this.selected[d].purchaseDate)) {
            this.$message(`选中的第` + (parseInt(d) + 1) + `条数据未填写填写采购日期`, 'warning')
            this.selected = []
            return
          } else if (this.selected[d].purchaseDate > this.selected[d].date) {
            this.$message(`选中的第` + (parseInt(d) + 1) + `条数据采购日期不能晚于需求日期`, 'warning')
            this.selected = []
            return
          } else if (this.selected[d].purchaseDate < key) {
            this.$message(`选中的第` + (parseInt(d) + 1) + `条数据采购日期早于了当前日期`, 'warning')
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
      procurementPlan.saveOrUpdate(purchase, this.selected)
        .then(() => {
          this.submitDialog = false
          this.$router.push({ name: 'procurementPlanManagement' })
        }).finally(() => { this.submitLoading = true })
    },
    handleAnd () {
      // 合并数据
      if (this.selected.length < 2) {
        this.$message('数据少于2条,不能合并', 'error')
        return
      }
      let item = this._.cloneDeep(this.selected[0])
      let ids = [item['id']]
      if (item['id'] === null) {
        this.$message('新添加的物料不允许合并')
        return
      }
      item['id'] = null
      item['planId'] = null
      item['createTime'] = null
      item['createUser'] = null
      item['status'] = 'INIT'
      item['materialTrackingCode'] = uuidv4()
      if (item['remark'] === null && item['departmentName'] !== null) {
        item['remark'] = item['departmentName']
      }
      for (let i = 1; i < this.selected.length; i++) {
        if (this.selected[i]['id'] === null) {
          this.$message('新添加的物料不允许合并')
          return
        }
        if (item['materialId'] !== this.selected[i]['materialId']) {
          this.$message('物料不同，不能合并')
          return
        }
        if (item['supplyMode'] !== this.selected[i]['supplyMode']) {
          this.$message('供应方式不同,不能合并')
          return
        }
        if (this.mergeRule.date && this.selected[i]['date'] !== item['date']) {
          this.$message('需求日期不一致,不能合并')
          return
        } else {
          item['date'] = item['date'] < this.selected[i]['date'] ? item['date'] : this.selected[i]['date']
        }
        if (this.mergeRule.fixedSupplier && this.selected[i]['fixedSupplier'] !== item['fixedSupplier']) {
          this.$message('固定供应商不一致,不能合并')
          return
        } else if (!this.mergeRule.fixedSupplier && this.selected[i]['fixedSupplier'] !== item['fixedSupplier']) {
          item['fixedSupplier'] = null
        }
        if (this.mergeRule.expectationSupplier && this.selected[i]['expectationSupplier'] !== item['expectationSupplier']) {
          this.$message('期待供应商不一致,不能合并')
          return
        } else if (!this.mergeRule.fixedSupplier && this.selected[i]['expectationSupplier'] !== item['expectationSupplier']) {
          item['expectationSupplier'] = null
        }
        item['number'] += this.selected[i]['number']
        if (item['remark'] === null && this.selected[i]['departmentName'] !== null) {
          item['remark'] = this.selected[i]['departmentName']
        } else if (item['remark'] !== null && this.selected[i]['departmentName'] !== null && item['remark'].search(this.selected[i]['departmentName']) === -1) {
          item['remark'] += ',' + this.selected[i]['departmentName']
        }
        ids.push(this.selected[i]['id'])
        if (item['supplyNumber'] !== null) {
          if (this.selected[i]['supplyNumber'] !== null) {
            item['supplyNumber'] += this.selected[i]['supplyNumber']
          } else {
            item['supplyNumber'] = null
          }
        }
      }
      planMaterialAPI.mergeMaterialPlan(item, ids).then(res => {
        for (let i = 0; i < this.selected.length; i++) {
          this.desserts.splice(this.desserts.indexOf(this.selected[i]), 1)
        }
        this.desserts.unshift(res.data)
        this.selected = []
        this.$message('合并成功', 'success')
      })
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
