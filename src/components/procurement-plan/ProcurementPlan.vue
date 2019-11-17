<template lang="pug">
  v-card.one-procurement
    more-btn
      v-btn(fab, small, color="green", dark, @click="print")
        v-icon mdi-printer-settings
    v-card-title {{see ? '查看' : '编辑'}}
    v-card-text
      v-container.mb-4(grid-list-md)
        v-form
          v-layout(wrap, style="width:100%")
            v-flex(sm12, md6, lg4)
              v-text-field(v-model="procurementPlan.name", label="采购计划名称", :disabled="see")
            v-flex(sm12, md6, lg4)
              v-select(v-model="procurementPlan.planStatus", :items="planStatus", item-value='value',
                item-text='name', label="计划状态", disabled)
            v-flex(sm12, md6, lg4)
              v-select(v-model="procurementPlan.approvalStatus", :items="approvalStatus", item-value='value',
                item-text='name', label="审批状态", disabled)
            v-flex(sm12, md6, lg4)
              v-text-field(v-model="procurementPlan.planType", label="计划类型", disabled,
                persistent-hint, hint="此字段为自动生成")
            v-flex(sm12, md6, lg4)
              v-text-field(v-model="procurementPlan.createTime", label="创建时间", disabled)
            v-flex(sm12, md6, lg4)
              v-text-field(v-model="procurementPlan.modifyTime", label="创建用户", disabled)
      v-data-table(:headers="headers", :items="desserts", :loading="load.table", loading-text="加载中......", show-select,
        style="width:100%", item-key="id", :mobile-breakpoint="1200", no-data-text="暂无数据", no-results-text="暂无数据")
        template(v-slot:top)
          v-toolbar(flat)
            v-spacer
            v-btn(text, color="success", outlined, :disabled="see", @click="handleAdd") 添加
        template(v-slot:item.isSourceGoods="{ item }")
          span {{item.isSourceGoods?'是':'否'}}
        template(v-slot:item.supplyNumber="{ item }")
          span {{item.supplyMode === '采购' ?item.supplyNumber :'无'}}
        template(v-slot:item.purchaseDate="{ item }")
          span {{item.supplyMode === '采购'? item.purchaseDate :'无'}}
        template(v-slot:item.status="{ item }")
        template(v-slot:item.action="{ item }")
          v-tooltip(top)
            template(v-slot:activator="{ on }")
              v-btn.mr-2(outlined, rounded, x-small, fab, color="success", v-on="on", @click="handleSee(item)")
                v-icon remove_red_eye
            span 查看
          v-tooltip(top, v-if="item.new || item.departmentName === '采购部门'")
            template(v-slot:activator="{ on }")
              v-btn.mr-2(outlined, rounded, x-small, fab, color="success", @click="handleEdit(item)", v-on="on", :disabled="see")
                v-icon mdi-pencil
            span 编辑
          v-tooltip(top, v-if="item.new")
            template(v-slot:activator="{ on }")
              v-btn.mr-2(outlined, rounded, x-small, fab, color="warning", @click="handleDelete(item)", v-on="on", :disabled="see")
                v-icon delete
            span 删除
          v-tooltip(top, v-if="item.departmentName !== '采购部门'")
            template(v-slot:activator="{ on }")
              v-btn.mr-2(outlined, rounded, x-small, fab, color="error", @click="handleReturn(item)", v-on="on", :disabled="see")
                v-icon mdi-backburger
            span 需求退回
      v-dialog(v-model="returnDialog", max-width="500px", persistent)
        v-card(tile)
          v-card-title.pa-0
            v-toolbar(flat, dark, color="primary")
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
            v-btn(text, color="success", @click="handleReturnSubmit") 确认退回
      v-dialog(v-model="dialog", max-width="800px", persistent)
        v-card(tile)
          v-card-title.pa-0
            v-toolbar(flat, dark, color="primary")
              v-toolbar-title 添加
              v-spacer
              v-btn(icon, dark, @click="handleClose")
                v-icon mdi-close
          v-card-text
            v-container.mb-4(grid-list-md)
              v-form(ref="edit")
                v-layout(wrap, style="width:100%")
                  v-flex(xs12, md6, md4)
                    v-select(v-model="editedItem.materialType", label="物料分类", :items="materialTypes", @change="materialTypeSelect",
                      item-text="name", return-object, :rules="rules.union(rules.required('物料分类'))", :disabled="seeOne")
                  v-flex(xs12, md6, md4)
                    v-select(v-model="editedItem.material", label="物料", :items="materials", @change="materialSelect", item-text="name",
                      return-object, :rules="rules.union(rules.required('物料'))", no-data-text="未选择物料分类或当前分类下无物料信息", :disabled="seeOne")
                  v-flex(xs12, md6, md4)
                    v-text-field(v-model="editedItem.lowNumber", label="最低库存", :rules="rules.union(rules.required('最低库存'))",
                      readonly, hint="当前物料最低库存", :disabled="seeOne")
                  v-flex(xs12, md6, md4)
                    v-text-field(v-model="editedItem.specifications", label="规格", :rules="rules.union(rules.required('规格'))",
                      readonly, hint="当前物料规格", :disabled="seeOne")
                  v-flex(xs12, md6, md4)
                    v-text-field(v-model="editedItem.size", label="型号", :rules="rules.union(rules.required('型号'))",
                      readonly, hint="当前物料型号", :disabled="seeOne")
                  v-flex(xs12, md6, md4)
                    v-text-field(v-model="editedItem.unit", label="计量单位", :rules="rules.union(rules.required('计量单位'))",
                      readonly, hint="当前物料计量单位", :disabled="seeOne")
                  v-flex(xs12, md6, md4)
                    v-text-field(v-model="editedItem.number", label="需求数量", type="number", :rules="rules.union(rules.requiredMessage('需求数量'))",
                      hint="当前物料所需数量", :disabled="seeOne")
                  v-flex(xs12, md6, md4)
                    v-menu(v-model="dayMenu", :close-on-content-click="false", transition="scale-transition",
                      offset-y, max-width="290px", min-width="290px")
                      template(v-slot:activator="{ on }")
                        v-text-field(v-model="editedItem.date", v-on="on", label="需求日期", readonly,
                          :rules="rules.union(rules.required('需求日期'))", :disabled="seeOne")
                      v-date-picker(v-model="needDate", no-title, @input="dayMenu = false", locale="zh-cn")
                  v-flex(xs12, md6, md4)
                    v-select(v-model="editedItem.supplyMode", label="供应方式", :rules="rules.union(rules.requiredMessage('供应方式'))",
                      hint="供应方式", :items="supplyMode", :disabled="seeOne")
                  v-flex(xs12, md6, md4, v-if="editedItem.supplyMode === '采购'")
                    v-text-field(v-model="editedItem.supplyNumber", label="供应数量", type="number", :rules="rules.union(rules.requiredMessage('供应数量'))",
                      hint="当前物料供应数量", :disabled="seeOne")
                  v-flex(xs12, md6, md4, v-if="editedItem.supplyMode === '采购'")
                    v-menu(v-model="purchaseMenu", :close-on-content-click="false", transition="scale-transition",
                      offset-y, max-width="290px", min-width="290px")
                      template(v-slot:activator="{ on }")
                        v-text-field(v-model="editedItem.purchaseDate", v-on="on", label="采购日期", readonly,
                          :rules="rules.union(rules.required('采购日期'))", :disabled="seeOne")
                      v-date-picker(v-model="purchaseDate", no-title, @input="purchaseMenu = false", locale="zh-cn")
                  v-flex(xs12, md6, md4)
                    v-select(v-model="editedItem.expectationSupplier", label="期望供应商", :items="suppliers",
                      item-text="name", item-value="name", :disabled="seeOne")
                  v-flex(xs12, md6, md4)
                    v-select(v-model="editedItem.fixedSupplier", label="固定供应商", :items="suppliers",
                      item-text="name", item-value="name", :disabled="seeOne")
                  v-flex(xs12, md6, md4)
                    v-select(v-model="editedItem.inventory", label="需求库存组织", :items="inventory",
                      item-text="name", item-value="name", :disabled="seeOne")
                  v-flex(xs12, md6, md4)
                    v-text-field(:value="editedItem.materialTrackingCode", label="物料追踪码", readonly,
                      hint="此项为随机生成，请勿修改", persistent-hint, :disabled="seeOne")
                  v-flex(xs12, md6, md4)
                    v-switch(v-model="editedItem.isSourceGoods", :disabled="seeOne", :label="`货源是否确定:${editedItem.isSourceGoods ? '是': '否'}`")
          v-card-actions(v-if="!seeOne")
            v-spacer
            v-btn(text, color="error", @click="handleReset") 重置
            v-btn(text, color="success", @click="handleActionOne") {{editIndex < 0 ? '添加' : '保存修改'}}
    v-card-actions
      slot
      v-spacer
      v-btn(text, color='primary', v-if="procurementPlan.planStatus === 'FREE' && !see", @click="handleSave(true)", outlined) 保存并提交审批
      v-btn(text, color="primary", v-if="procurementPlan.planStatus === 'FREE'", @click="handleSave(false)", outlined) {{ see ? '编辑' : '保存' }}
</template>

<script>
import { requiredRules, unionRules, requiredMessageRules } from '_u/rule'
import MoreBtn from '_c/more-btn/MoreBtn'
import * as restAPI from '_api/rest'
import * as procurementPlanAPI from '_api/procurementPlan'
import * as planMaterialAPI from '_api/planMaterial'
import { planStatusSelect, approvalStatusSelect } from '_u/status'
const uuidv4 = require('uuid/v4')

export default {
  name: 'ProcurementPlan',
  components: {
    MoreBtn
  },
  props: {
    seeId: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    dayMenu: false,
    returnDescription: '',
    purchaseMenu: false,
    returnMethod: true,
    returnItem: {},
    dialog: false,
    returnDialog: false,
    supplyMode: ['采购'],
    editedItem: {},
    editIndex: -1,
    load: {
      table: false
    },
    procurementPlan: {},
    desserts: [],
    planStatus: planStatusSelect,
    approvalStatus: approvalStatusSelect,
    needDate: new Date().toISOString().substr(0, 10),
    purchaseDate: new Date().toISOString().substr(0, 10),
    see: true,
    seeOne: true,
    materialTypes: [],
    suppliers: [],
    approval: {},
    rules: {
      required: requiredRules,
      requiredMessage: requiredMessageRules,
      union: unionRules
    },
    materials: [],
    materialItems: [],
    inventory: [],
    headers: [
      { text: '物料编码', value: 'materialCode', align: 'start' },
      { text: '物料名称', value: 'materialName', align: 'start' },
      { text: '物料分类编码', value: 'materialTypeCode', align: 'start' },
      { text: '物料分类名称', value: 'materialTypeName', align: 'start' },
      { text: '需求部门', value: 'departmentName', align: 'start' },
      { text: '需求日期', value: 'date', align: 'start' },
      { text: '供应方式', value: 'supplyMode', align: 'start' },
      { text: '供应数量', value: 'supplyNumber', align: 'start' },
      { text: '采购日期', value: 'purchaseDate', align: 'start' },
      { text: '计划来源', value: 'planSource', align: 'start' },
      { text: '货源是否确定', value: 'isSourceGoods', align: 'start' },
      { value: 'status', filter: value => value === 'INIT', sortable: false, width: '0px' },
      { text: '操作', value: 'action', sortable: false, width: '160px', align: 'start' }
    ]
  }),
  created () {
    restAPI.getAll('materialType').then(res => { this.materialTypes = res.data.content })
    restAPI.getAll('supplier').then(res => { this.suppliers = res.data.content })
    restAPI.getAll('inventory').then(res => { this.inventory = res.data.content })
    restAPI.getAll('material').then(res => { this.materialItems = res.data.content })
    this.initEdit()
    // restAPI.getLink(`procurementPlan/all/${this.seeId}`)
    this.load.table = true
    restAPI.getOne(`procurementPlan`, this.seeId)
      .then(res => {
        this.procurementPlan = res.data
        this.procurementPlan.createTime = res.data.createTime.replace('T', ' ')
        this.procurementPlan.modifyTime = res.data.modifyTime.replace('T', ' ')
      })
    procurementPlanAPI.getProcurementPlan(this.seeId)
      .then(res => {
        console.log(res)
        this.desserts = res.data
        this.desserts.forEach(pm => {
          if (pm.departmentName === null) pm.departmentName = '采购部'
        })
      }).finally(() => { this.load.table = false })
  },
  watch: {
    needDate (val) {
      if (!val) return
      this.editedItem.date = val.replace(/-/g, '')
    },
    purchaseDate (val) {
      if (!val) return
      this.editedItem.purchaseDate = val.replace(/-/g, '')
    }
  },
  methods: {
    initEdit () {
      this.editIndex = -1
      this.editedItem = {
        materialTypeId: null,
        materialId: null,
        materialName: null,
        materialCode: null,
        materialTypeName: null,
        materialTypeCode: null,
        materialType: null,
        material: null,
        specifications: null,
        supplyNumber: null,
        purchaseDate: null,
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
        planSource: '自制计划'
      }
    },
    handleSave (status) {
      if (this.see) {
        // 此时为编辑
        this.see = !this.see
      } else {
        // 此时为保存并提交
        if (status) {
          this.procurementPlan.planStatus = 'APPROVAL'
          this.procurementPlan.approvalStatus = 'APPROVAL_ING'
        }
        procurementPlanAPI.saveOrUpdate(this.procurementPlan, this.desserts)
          .then(res => {
            console.log(res)
            this.$message('操作成功！', 'success')
            this.see = !this.see
          })
      }
    },
    materialTypeSelect (item) {
      this.editedItem.material = null
      this.materials = this.materialItems.filter(material => { return material.typeId === item.id })
      this.editedItem.materialTypeId = item.id
      this.editedItem.materialTypeName = item.name
      this.editedItem.materialTypeCode = item.code
      this.editedItem.specifications = null
      this.editedItem.size = null
      this.editedItem.unit = null
      this.editedItem.lowNumber = null
      if (!this.seeOne) this.$refs.edit.resetValidation()
    },
    materialSelect (item) {
      this.editedItem.specifications = item.specifications
      this.editedItem.size = item.size
      this.editedItem.unit = item.unit
      this.editedItem.materialId = item.id
      this.editedItem.materialName = item.name
      this.editedItem.lowNumber = item.lowNumber
      this.editedItem.materialCode = item.code
    },
    handleAdd () {
      this.initEdit()
      this.dialog = true
      this.seeOne = false
    },
    handleActionOne () {
      if (!this.$refs.edit.validate(true)) return
      if (this.editIndex === -1) {
        this.editedItem.new = true
        this.desserts.unshift(this._.cloneDeep(this.editedItem))
      } else this.desserts.splice(this.editIndex, 1, this._.cloneDeepWith(this.editedItem))
      this.initEdit()
      this.dialog = false
      this.seeOne = true
      this.$refs.edit.resetValidation()
    },
    handleEdit (item) {
      this.editIndex = this._.indexOf(this.desserts, item)
      this.editedItem = this._.cloneDeepWith(item)
      this.dialog = true
      this.seeOne = false
    },
    handleReset () {
      if (this.editIndex < 0) this.initEdit()
      else this.handleEdit(this.desserts[this.editIndex])
      this.$refs.edit.resetValidation()
    },
    handleClose () {
      this.dialog = false
      this.seeOne = true
      this.editIndex = -1
      this.initEdit()
      this.$refs.edit.resetValidation()
    },
    handleDelete (item) {
      if (item.new) this.desserts.splice(this._.indexOf(this.desserts, item), 1)
      else item.status = 'BACK'
    },
    handleCloseReturn () {
      this.returnDialog = false
      this.returnItem = {}
      this.returnDescription = ''
    },
    handleReturn (item) {
      this.returnDialog = true
      this.returnItem = this._.cloneDeep(item)
    },
    handleSee (item) {
      this.dialog = true
      this.seeOne = true
      this.editedItem = item
      this.editedItem.materialType = this._.find(this.materialTypes, { code: item.materialTypeCode })
      this.materialTypeSelect(this.editedItem.materialType)
      this.editedItem.material = this._.find(this.materials, { code: item.materialCode })
      this.materialSelect(this.editedItem.material)
    },
    initApproval () {
      this.approval = {
        description: '',
        plan: null,
        result: null,
        approvalType: '',
        planId: -1
      }
    },
    handleReturnSubmit () {
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
        }
        )
    },
    print () {
      this.$router.push({
        name: 'print',
        params: {
          model: this.procurementPlan,
          flag: 'procurementPlan',
          desserts: this.desserts
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
