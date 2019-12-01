<template lang="pug">
  .procurement-plan-select
    v-dialog(v-model="show", hide-overlay, transition="dialog-bottom-transition", scrollable, fullscreen)
      v-card(tile)
        v-toolbar(flat, color="primary", dark, dense)
          v-toolbar-title 选单
          v-spacer
          v-toolbar-items
            v-btn(icon,  @click="handleClose", color="white")
              v-icon mdi-close
        v-card-text
          v-expansion-panels.mt-2
            v-expansion-panel
              v-expansion-panel-header 查看选单规则
              v-expansion-panel-content
                p 1. 在左边区域选择您要查找的
                  strong.primary--text 采购计划
                p 2. 系统会自动加载出当前采购计划的
                  strong.primary--text 物料信息
                p 3. 点击相应的物料信息前的多选框，将会自动添加到
                  strong.primary--text 右边区域中
                p 4. 点击确认后，系统才会添加进入表格之中，直接关闭将会
                  strong.error--text 丢失数据
          v-row.ma-1.mt-4.elevation-4(justify="space-between")
            v-col
              v-card-text
                v-treeview(v-model="selected", :items="plans", :load-children="loadMaterials", transition,
                  open-on-click, color="warning",  item-key="id", selectable, return-object)
                  template(v-slot:label="{ item, leaf }")
                    span(v-if="!leaf") {{item.name}} - {{item.planType}}
                    span(v-else) {{item.name}}
            v-divider(vertical)
            v-col(cols="12", md="6", lg="8")
              v-card-text
                v-data-table(:headers="headers", :items="select", no-data-text="暂无数据", no-results-text="暂无数据")
                  template(v-slot:item.action="{ item }")
                    v-tooltip(top)
                      template(v-slot:activator="{ on }")
                        v-btn(outlined, rounded, x-small, fab, color="error", @click="handleDelete(item)", v-on="on")
                          v-icon mdi-delete
                      span 删除
                  template(v-slot:top)
                    v-toolbar(flat)
                      v-spacer
                      v-btn(outlined, color="error", @click="selected = []") 清除所有
        v-card-actions
          v-spacer
          v-btn(outlined, color="error", @click="handleReset") 重置
          v-btn(outlined, color="success", @click="handleSave") 保存
</template>

<script>
import * as RESTAPI from '_api/rest'
export default {
  name: 'ProcurementPlanSelect',
  props: {
    materials: {
      type: Array,
      required: true
    },
    order: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    show: false,
    plans: [],
    selected: [],
    headers: [
      { text: '物料编码', value: 'code', align: 'start' },
      { text: '物料名称', value: 'name', align: 'start' },
      { text: '规格', value: 'specifications', align: 'start' },
      { text: '型号', value: 'size', align: 'start' },
      { text: '需求数量', value: 'number', align: 'start' },
      { text: '需求日期', value: 'date', align: 'start' },
      { text: '操作', value: 'action', sortable: false, width: '150px', align: 'center' }
    ]
  }),
  computed: {
    select () {
      return this.selected.filter(v => v.hasOwnProperty('code'))
    }
  },
  watch: {
    'order.type' (val) {
      let resourceLink = 'procurementPlan/search/byStatus?planStatus=FINALLY&approvalStatus=APPROVAL_OK'
      if (val === '紧急订单') {
        resourceLink = 'procurementPlan/search/byPlanType?planType=紧急采购计划'
      }
      RESTAPI.getRestLink(resourceLink).then(res => {
        res.data.content.forEach(value => {
          this.plans.push(Object.assign({
            id: 0,
            name: `名称`,
            planType: '年度采购计划',
            children: []
          }, value))
        })
      }).catch(() => {
        this.plans = []
      })
    }
  },
  methods: {
    handleClose () {
      this.show = false
    },
    loadMaterials: async function (item) {
      try {
        let res = await RESTAPI.getRestLink(`planMaterial/search/byProcurementPlanId?procurementPlanId=${item.id}`)
        item.children.push(...res.data.content)
        await item.children.some(value => {
          let material = this._.find(this.materials, { id: value.materialId })
          if (material === undefined) {
            throw Error('undefined', 'material data is undefined')
          }
          value.name = material.name
          value.code = material.code
          value.specifications = material.specifications
          value.size = material.size
        })
      } catch (e) {
        item.children.length = 0
      }
    },
    handleDelete (item) {
      this.selected.splice(this._.indexOf(this.selected, item), 1)
    },
    handleSave () {
      this.$emit('select', this.selected)
      this.handleReset()
    },
    handleReset () {
      this.selected = []
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
