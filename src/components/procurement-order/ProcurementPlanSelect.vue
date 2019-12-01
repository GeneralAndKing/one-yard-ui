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
                  open-on-click, color="warning",  item-key="name", selectable, return-object)
                  template(v-slot:label="{ item, leaf }")
                    span(v-if="!leaf") {{item.name}} - {{item.planType}}
                    span(v-else) {{item.name}}
            v-divider(vertical)
            v-col(cols="12", md="6", lg="9")
              v-card-text
                v-data-table(:headers="headers", :items="selected", no-data-text="暂无数据", no-results-text="暂无数据")
                  template(v-slot:item.action="{ item }")
                    v-tooltip(top)
                      template(v-slot:activator="{ on }")
                        v-btn(outlined, rounded, x-small, fab, color="error", @click="handleDelete(item.name)", v-on="on")
                          v-icon mdi-delete
                      span 删除
        v-card-actions
          v-spacer
          v-btn(outlined, color="error", @click="handleReset") 重置
          v-btn(outlined, color="success", @click="handleSave") 保存
</template>

<script>
// import * as RESTAPI from '_api/rest'
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
export default {
  name: 'ProcurementPlanSelect',
  props: {
    materials: {
      type: Array,
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
  created () {
    // TODO: 初始化所有符合状态的采购计划数据
    for (let i = 0; i < 5; i++) {
      this.plans.push({
        id: i,
        name: `名称${i}`,
        planType: '年度采购计划',
        createTime: `2019-11-20 19:26:0${i}`,
        createUser: `创建用户${i}`,
        // TODO：获取到数据以后，要给所有的数据添加一个 children 属性！！！
        children: []
      })
    }
  },
  methods: {
    handleClose () {
      this.show = false
    },
    async loadMaterials (item) {
      await pause(1500)
      // TODO：异步加载当前所选采购计划下的物料信息
      for (let i = 0; i < 5; i++) {
        item.children.push({
          id: 1,
          name: `${item.name}-物料${i}`,
          code: `编码1`,
          specifications: '个',
          size: '大',
          // TODO：以下字段是物料表里面没有的，从 plan_material 得到的
          // 所以我们需要先根据采购计划 id 查找到 plan_material，然后把以下属性填充进物料里面去
          // 但是不能够修改 this.materials 因为他是父组件传递过来的
          // 在这里请求到的数据要
          number: 1,
          date: '2019-01-25'
        })
      }
    },
    handleDelete (name) {
      this.selected.splice(this._.indexOf(this.selected, name), 1)
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
