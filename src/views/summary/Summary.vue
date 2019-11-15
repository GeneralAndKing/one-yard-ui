<template lang="pug">
  v-container.one-summary
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
                v-btn(color="primary", @click="handleSelect") 查询
        v-data-table(:headers="headers", :items="desserts", :loading="loading", loading-text="加载中......", style="width:100%",
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
                v-btn.mr-2(outlined, rounded, x-small, fab, color="error", @click="handleBack(item)", v-on="on")
                  v-icon mdi-arrow-collapse-left
              span 需求退回
        v-dialog(v-model="dialog", max-width="1200px", persistent)
          v-card
            v-card-title(primary-title)
              .headline.lighten-2 编辑数据
              v-spacer
              v-btn(icon,  @click="handleClose")
                v-icon mdi-close
              v-card-text
                v-form(ref="edit")
                  v-container(grid-list-md)
                    v-layout(wrap)
                      v-flex(xs12, md6, md4)
                        v-text-field(v-model="editedItem.material.code", label="物料编码", disabled)
                      v-flex(xs12, md6, md4)
                        v-text-field(v-model="editedItem.material.name", label="物料名称", disabled)
                      v-flex(xs12, md6, md4)
                        v-text-field(v-model="editedItem.materialType.code", label="物料分类编码", disabled)
                      v-flex(xs12, md6, md4)
                        v-text-field(v-model="editedItem.materialType.name", label="物料分类名称", disabled)
                      v-flex(xs12, md6, md4)
                        v-text-field(v-model="editedItem.number", label="需求数量", disabled)
                      v-flex(xs12, md6, md4)
                        v-text-field(v-model="editedItem.date", label="需求日期", disabled)
                      v-flex(xs12, md6, md4)
                        v-text-field(:value="editedItem.isSourceGoods? '是': '否'", label="货源是否确定", disabled)
                      v-flex(xs12, md6, md4)
                        v-text-field(v-model="editedItem.expectationSupplier", label="期望供应商", disabled)
                      v-flex(xs12, md6, md4)
                        v-text-field(v-model="editedItem.fixedSupplier", label="固定供应商", disabled)
                      v-flex(xs12, md6, md4)
                        v-text-field(v-model="editedItem.inventory", label="需求库存组织", disabled)
                      v-flex(xs12, md6, md4)
                        v-text-field(v-model="editedItem.material.specifications", label="规格", disabled)
                      v-flex(xs12, md6, md4)
                        v-text-field(v-model="editedItem.material.size", label="型号", disabled)
                      v-flex(xs12, md6, md4)
                        v-text-field(v-model="editedItem.material.unit", label="单位", disabled)
                      v-flex(xs12, md6, md4)
                        v-text-field(v-model="editedItem.supplyMode", label="供应方式", disabled)
                      v-flex(xs12, md6, md4)
                        v-text-field(v-model="editedItem.supplyNumber", label="供应数量", disabled)
                      v-flex(xs12, md6, md4)
                        v-text-field(v-model="editedItem.purchaseDate", label="采购日期", disabled)

</template>

<script>
import * as restAPI from '_api/rest'
import { requiredRules, unionRules } from '_u/rule'

export default {
  name: 'Summary',
  data: () => ({
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
    summary: [],
    headers: [
      { text: '物料编码', value: 'materialCode', align: 'center' },
      { text: '物料名称', value: 'materialName', align: 'center' },
      { text: '物料分类编码', value: 'materialTypeCode', align: 'center' },
      { text: '物料分类名称', value: 'materialTypeName', align: 'center' },
      { text: '需求部门', value: 'departmentName', align: 'center' },
      { text: '需求数量', value: 'number', align: 'center' },
      { text: '需求日期', value: 'date', align: 'center' },
      { text: '货源是否确定', value: 'isSourceGoods', align: 'center' },
      { text: '期望供应商', value: 'expectationSupplier', align: 'center' },
      { text: '固定供应商', value: 'fixedSupplier', align: 'center' },
      { text: '操作', value: 'action', sortable: false, width: '160px', align: 'center' }
    ],
    rules: {
      union: unionRules,
      required: requiredRules
    }
  }),
  created () {
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
  methods: {
    initEditedItem () {
      this.editedItem = {
        createTime: '2019-11-06T02:22:20',
        createUser: 'admin',
        date: '20191106',
        expectationSupplier: null,
        fixedSupplier: null,
        id: 2,
        inventory: null,
        isEnable: true,
        isSourceGoods: true,
        material: Object,
        materialId: 1,
        materialTrackingCode: 'KhuDHFYnd#@dd254',
        materialType: Object,
        materialTypeId: 1,
        modifyTime: '2019-11-06T02:22:20',
        modifyUser: 'admin',
        name: null,
        number: 50,
        planId: 2,
        procurementPlanId: null,
        purchaseDate: null,
        remark: null,
        sort: 1,
        status: 'INIT',
        supplyMode: null,
        supplyNumber: null
      }
    },
    handleSelect () {
      if (!this.$refs.select.validate()) return
      console.log(this.searchValue)
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
          console.log(res)
          this.desserts = res.data.planMaterials
        })
        .finally(() => { this.loading = false })
    },
    handleEdit (item) {
      this.editedItem = this._.cloneDeep(item)
      this.editedIndex = this.desserts.indexOf(item)
      this.dialog = true
    },
    handleBack (item) {
      //
    },
    handleClose () {
      this.dialog = false
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
