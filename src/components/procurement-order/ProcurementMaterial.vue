<template lang="pug">
  .one-info
    v-data-table(v-model="selected", :headers="headers", :items="value", :loading="loading",  no-data-text="暂无数据", no-results-text="暂无数据",
      :mobile-breakpoint="900", show-select, item-key="name", :search="search")
      template(v-slot:item.materialCode="{ item }")
        span {{item.material.code}}
      template(v-slot:item.materialName="{ item }")
        span {{item.material.name}}
      template(v-slot:item.materialSpecifications="{ item }")
        span {{item.material.specifications}}
      template(v-slot:item.materialSize="{ item }")
        span {{item.material.size}}
      template(v-slot:item.isComplimentary="{ item }")
        span(:class="item.isComplimentary ? 'success--text' : 'error--text'") {{item.isComplimentary ? '是' : '否'}}
      template(v-slot:item.action="{ item }")
        v-tooltip(top)
          template(v-slot:activator="{ on }")
            v-btn.mr-1(outlined, rounded, x-small, fab, color="success", @click="handleEdit(item)", v-on="on", :disabled="see")
              v-icon mdi-pencil
          span 编辑
        v-tooltip(top)
          template(v-slot:activator="{ on }")
            v-btn.mr-1(outlined, rounded, x-small, fab, color="info", @click="handleCopy(item)", v-on="on" :disabled="see" v-if="!change")
              v-icon file_copy
          span 复制
        v-tooltip(top, v-if="item.status === 'CHANGED'")
          template(v-slot:activator="{ on }")
            v-btn.mr-1(outlined, rounded, x-small, fab, color="secondary", @click="handleHistory(item)", v-on="on", v-if="!change")
              v-icon mdi-attachment
          span 变更历史
        v-tooltip(top)
          template(v-slot:activator="{ on }")
            v-btn(outlined, rounded, x-small, fab, color="error", @click="handleDelete(item)", v-on="on" :disabled="see||item.isSelect!==undefined" v-if="!change")
              v-icon mdi-delete
          span 删除
      template(v-slot:top)
        v-toolbar(flat, style="overflow: auto;")
          v-toolbar-title
            p.grey--text 当前订单的物料明细
          v-spacer
          v-text-field.mr-4(
            v-model="search",
            append-icon="search",
            label="请输入关键字以查找",
            single-line,
            hide-details,
            style="display: block ruby;"
          )
          v-btn.mr-4(outlined, color="info", @click="handlePlan", :disabled='see' v-if="!change") 选单
          v-btn.mr-4(outlined, color="success", @click="handleAdd", :disabled='see' v-if="!change") 添加
          v-btn(outlined, color="error", @click="handleDeleteSelect", :disabled='see' v-if="!change") 删除所选
    procurement-material-edit(v-model="item", ref="add", :materials="materials", @submit="handleSubmit" :change="change")
    procurement-plan-select(ref="planSelect", :materials="materials", :order="order" @select="handlePlanSelect")
    change-history(v-if="id > 0", :item="order", :procurementMaterial="value", :id="id", ref="materials")

</template>

<script>
import ProcurementMaterialEdit from './ProcurementMaterialEdit'
import ProcurementPlanSelect from './ProcurementPlanSelect'
import ChangeHistory from '_c/procurement-order/change-history'
import { getTime } from '_u/util'

export default {
  name: 'ProcurementMaterial',
  components: {
    ProcurementMaterialEdit,
    ProcurementPlanSelect,
    ChangeHistory
  },
  props: {
    value: { type: Array, required: true },
    see: { type: Boolean, required: true },
    change: { type: Boolean, required: true },
    loading: { type: Boolean, default: false },
    order: { type: Object, required: true },
    materials: { type: Array, required: true }
  },
  data: () => ({
    // 添加的时候为 null, 否则为要编辑的元素
    item: null,
    search: '',
    selected: [],
    headers: [
      { text: '物料名称', value: 'materialName', align: 'start' },
      { text: '规格', value: 'materialSpecifications', align: 'start' },
      { text: '型号', value: 'materialSize', align: 'start' },
      { text: '采购单位', value: 'procurementUnit', align: 'start' },
      { text: '采购数量', value: 'procurementNumber', align: 'start' },
      { text: '交货日期', value: 'deliveryDate', align: 'start' },
      { text: '单价', value: 'unitPrice', align: 'start' },
      { text: '含税单价', value: 'taxableUnitPrice', align: 'start' },
      { text: '税率', value: 'taxRate', align: 'start' },
      { text: '税额', value: 'taxAmount', align: 'start' },
      { text: '总价', value: 'totalPrice', align: 'start' },
      { text: '含税总价', value: 'taxTotalPrice', align: 'start' },
      { text: '是否赠品', value: 'isComplimentary', align: 'start' },
      { text: '需求部门', value: 'demandDepartment', align: 'start' },
      { text: '收料部门', value: 'materialReceivingDepartment', align: 'start' },
      { text: '操作', value: 'action', sortable: false, width: '180px', align: 'center' }
    ],
    history: [],
    id: 0
  }),
  methods: {
    handlePlan () {
      if (!(this.order.type)) {
        this.$message('未选择采购订单类型', 'error')
      } else {
        this.$refs.planSelect.show = true
      }
    },
    handlePlanSelect (selectItems) {
      this.$emit('select', selectItems)
    },
    handleAdd () {
      this.item = null
      this.$refs.add.handleShow()
    },
    handleDeleteSelect () {
      let isPlan = false
      this.selected.forEach(item => {
        if (item.isSelect === undefined) {
          this.value.splice(this._.indexOf(this.value, item), 1)
        } else {
          isPlan = true
        }
      })
      if (isPlan) {
        this.$message('采购计划物料请到选单页面删除', 'warning')
      }
      this.selected = []
    },
    handleDelete (item) {
      this.value.splice(this._.indexOf(this.value, item), 1)
    },
    handleEdit (item) {
      this.item = item
      this.$refs.add.handleShow()
    },
    handleCopy (item) {
      let newItem = this._.cloneDeep(item)
      newItem.name = `${getTime()}}-${item.materialId}-${Math.ceil(Math.random() * 100)}`
      newItem.planMaterialId = undefined
      newItem.isSelect = undefined
      this.value.unshift(newItem)
    },
    // 这个事件是添加或者编辑成功以后，添加到表格之中的事件
    // 参数是修改后的元素，原来的元素是 this.item
    handleSubmit (item) {
      item.material = this._.find(this.materials, { id: item.materialId })
      if (this.item === null) {
        // 添加成功
        // 添加一个不重复的主键
        item.name = `${getTime()}-${item.materialId}-${Math.ceil(Math.random() * 100)}`
        this.value.unshift(item)
        this.$refs.add.handleReset()
      } else {
        // 编辑成功
        this.value.splice(this._.indexOf(this.value, this.item), 1, item)
      }
    },
    handleHistory (item) {
      this.id = item.id
      this.$refs.materials.show = true
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
