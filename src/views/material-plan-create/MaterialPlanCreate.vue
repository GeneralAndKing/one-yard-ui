<template lang="pug">
  v-container#one-plan-create
    v-speed-dial(v-model="fab", bottom, right, fixed,
      transition='slide-y-reverse-transition', direction='top')
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
                v-select(v-model="materialPlan.planTypes", :items="planTypes", ref="planTypes", label="需求计划类型")
              v-flex(sm12, md6, lg4)
                v-select(v-model="materialPlan.departmentId", :items="departments", ref="departmentId",
                  item-text="name", item-value="id", label="需求部门")
              v-flex(sm12, md6, lg4)
                v-text-field(value="自由", label="需求计划状态", readonly)
              v-flex(sm12, md6, lg4)
                v-text-field(v-model="materialPlan.name", ref="name", label="需求计划名称")
              v-flex(sm12, md6, lg4)
                v-text-field(v-model="materialPlan.needPeople", ref="needPeople", label="需求人员")
              v-flex(sm12, md6, lg4)
                v-text-field(value="未提交", label="审批状态", readonly)
              v-flex(xs12, md6, md4)
                v-menu(ref="month", :close-on-content-click="false", :return-value.sync="date", transition="scale-transition",
                  v-model="menu", max-width="290px", min-width="290px")
                  template(v-slot:activator="{ on }")
                    v-text-field(v-model="materialPlan.month", label="需求月份", readonly, v-on="on")
                  v-date-picker(v-model="date", type="month", no-title, scrollable, locale="zh-cn")
                    v-spacer
                    v-btn(text, color="primary",  @click="menu = false") 取消
                    v-btn(text, color="primary",  @click="$refs.month.save(date)") 选择
              v-flex(sm12, md6, lg4)
                v-text-field(v-model="materialPlan.remark", label="备注")
              v-flex(sm12, md6, lg4)
                v-switch(v-model="materialPlan.isBudgetPlan", :label="`是否预算内计划：${materialPlan.isBudgetPlan? '是' : '否'}`")
        v-data-table(:headers="headers", :items="desserts", item-key="id", :mobile-breakpoint="1200")
          template(v-slot:top)
            v-toolbar(flat, justify-content="right")
              h3 您的物料单
              v-spacer
              v-dialog(v-model="dialog", max-width="1200px", persistent)
                template(v-slot:activator="{ on }")
                  v-btn.mb-2.ml-3.mr-3(color="primary", v-on="on") 添加
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
                            v-select(v-model="editedItem.materialType", label="物料分类", :items="materialTypes", item-text="name")
                          v-flex(xs12, md6, md4)
                            v-select(v-model="editedItem.material", label="物料", :items="materials", item-text="name")
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
                                v-text-field(v-model="editedItem.date", v-on="on")
                              v-date-picker(v-model="editedItem.date", no-title, @input="dayMenu = false", label="需求日期")
                          v-flex(xs12, md6, md4)
                            v-text-field(v-model="editedItem.isSourceGoods", label="货源是否确定")
                          v-flex(xs12, md6, md4)
                            v-text-field(v-model="editedItem.expectationSupplier", label="期望供应商")
                          v-flex(xs12, md6, md4)
                            v-text-field(v-model="editedItem.fixedSupplier", label="固定供应商")
                          v-flex(xs12, md6, md4)
                            v-text-field(v-model="editedItem.inventory", label="需求库存组织")
                          v-flex(xs12, md6, md4)
                            v-text-field(v-model="editedItem.materialTrackingCode", label="物料追踪码")
                  v-card-actions
                    v-spacer
                    v-btn(color="primary", @click="initEdit") 重置
                    v-btn(color="primary", @click="handleAdd") 添加
      v-card-actions
        v-spacer
        v-btn(color="primary") 保存
        v-btn(color="primary") 保存并提交
</template>

<script>

export default {
  name: 'MaterialPlanCreate',
  data: () => ({
    menu: false,
    dayMenu: false,
    fab: false,
    dialog: false,
    materialTypes: [
      { code: '123', name: '123' },
      { code: '124', name: '124' },
      { code: '125', name: '125' },
      { code: '126', name: '126' },
      { code: '127', name: '127' }
    ],
    materials: [
      { code: '123', name: '123' },
      { code: '124', name: '124' },
      { code: '125', name: '125' },
      { code: '126', name: '126' },
      { code: '127', name: '127' }
    ],
    date: new Date().toISOString().substr(0, 7),
    planTypes: [ '订单型需求计划', '年度计划', '月度计划', '紧急计划' ],
    departments: [
      { id: 1, name: '部门1' },
      { id: 2, name: '部门2' },
      { id: 3, name: '部门3' }
    ],
    editedItem: {},
    materialPlan: {
      materialType: null,
      material: null,
      name: null,
      planType: null,
      departmentId: null,
      needPeople: null,
      planStatus: 0,
      approvalStatus: 0,
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
      { text: '物料追踪码', value: 'materialTrackingCode' }
    ]
  }),
  created () {
    this.initEdit()
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
        isSourceGoods: null,
        expectationSupplier: null,
        fixedSupplier: null,
        inventory: null,
        materialTrackingCode: null
      }
    },
    handleAdd () {
      this.editedItem.materialTypeCode = this.editedItem.materialType.materialTypeCode
      this.editedItem.materialTypeName = this.editedItem.materialType.materialTypeName
      this.editedItem.materialCode = this.editedItem.material.materialCode
      this.editedItem.materialName = this.editedItem.material.materialName
      this.desserts.unshift(this.editedItem)
      this.initEdit()
    },
    formatDate (date) {
      if (!date) return null
      const [year, month] = date.split('-')
      return `${year}${month}`
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
