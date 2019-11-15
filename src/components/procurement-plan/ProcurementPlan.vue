<template lang="pug">
  v-card.one-procurement
    v-card-title 查看
    v-card-text
      v-container(grid-list-md)
        v-form
          v-layout(wrap, style="width:100%")
            v-flex(sm12, md6, lg4)
              v-text-field(v-model="procurementPlan.name", label="采购计划名称", :disabled="see")
            v-flex(sm12, md6, lg4)
              v-select(v-model="procurementPlan.planStatus", :items="planStatus", item-value='value',
                item-text='name', label="需求计划状态", :disabled="see")
            v-flex(sm12, md6, lg4)
              v-select(v-model="procurementPlan.approvalStatus", :items="approvalStatus", item-value='value',
                item-text='name', label="审批状态", :disabled="see")
            v-flex(sm12, md6, lg4)
              v-text-field(v-model="procurementPlan.planType", label="需求计划类型", disabled,
                persistent-hint, hint="此字段为自动生成")
            v-flex(sm12, md6, lg4)
              v-text-field(v-model="procurementPlan.createTime", label="创建时间", disabled)
            v-flex(sm12, md6, lg4)
              v-text-field(v-model="procurementPlan.modifyTime", label="创建用户", disabled)
    v-card-actions
      slot
      v-btn(text, color="primary", @click="handleSave") {{ see ? '编辑' : '保存' }}
</template>

<script>
import * as restAPI from '_api/rest'
import { planStatusSelect, approvalStatusSelect } from '_u/status'

export default {
  name: 'ProcurementPlan',
  props: {
    seeId: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    procurementPlan: {},
    planMaterials: [],
    planStatus: planStatusSelect,
    approvalStatus: approvalStatusSelect,
    see: true,
    headers: [
      { text: '物料编码', value: 'materialCode', align: 'center' },
      { text: '物料名称', value: 'materialName', align: 'center' },
      { text: '物料分类编码', value: 'materialTypeCode', align: 'center' },
      { text: '物料分类名称', value: 'materialTypeName', align: 'center' },
      { text: '采购数量', value: 'supplyNumber', align: 'center' },
      { text: '需求日期', value: 'date', align: 'center' },
      { text: '采购日期', value: 'purchaseDate', align: 'center' },
      { text: '计划来源', value: 'planSource', align: 'center' },
      { text: '需求部门', value: 'planSource', align: 'center' },
      { text: '货源是否确定', value: 'isSourceGoods', align: 'center' },
      { text: '操作', value: 'action', sortable: false, width: '160px', align: 'center' }
    ]
  }),
  created () {
    restAPI.getLink(`procurementPlan/all/${this.seeId}`)
      .then(res => {
        this.procurementPlan = res.data
        this.procurementPlan.createTime = res.data.createTime.replace('T', ' ')
        this.procurementPlan.modifyTime = res.data.modifyTime.replace('T', ' ')
        this.planMaterials = res.data.planMaterials
        console.log(res.data)
      })
  },
  methods: {
    handleSave () {
      if (this.see) {
        // 此时为编辑
        // TODO: 采购计划编辑
        this.see = !this.see
      } else {
        // 此时为保存
        // TODO: 采购计划保存
        this.see = !this.see
      }
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
