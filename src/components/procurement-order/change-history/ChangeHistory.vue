<template lang="pug">
  #one-history
    v-dialog(v-model="show", hide-overlay, transition="dialog-bottom-transition", scrollable, fullscreen)
      v-card(tile)
        v-toolbar(flat, color="primary", dark, dense)
          v-toolbar-title 变更历史
          v-spacer
          v-toolbar-items
            v-btn(icon,  @click="handleClose", color="white")
              v-icon mdi-close
        v-card-text
          v-data-table(:headers="headers", :items="value")
            template(v-slot:item.materialName="{ item }")
              span(v-if="typeof item.procurementMaterial !== 'undefined'") {{item.procurementMaterial.material.name}}
            template(v-slot:item.createTime="{ item }")
              span(v-if="typeof item.createTime !== 'undefined'") {{item.createTime.replace("T", " ")}}
            template(v-slot:item.status="{ item }")
              span {{formatApprovalStatus(item.status)}}
</template>

<script>
import * as restAPI from '_api/rest'
import { approvalStatusSelect } from '_u//status'

export default {
  name: 'ChangeHistory',
  props: {
    item: { type: Object, required: true },
    procurementMaterial: { type: Array, required: true },
    id: { type: Number, default: 0 }
  },
  data: () => ({
    show: false,
    headers: [
      { text: '物料名称', value: 'materialName', align: 'start' },
      { text: '原采购数量', value: 'oldNumber', align: 'start' },
      { text: '新采购数量', value: 'newNumber', align: 'start' },
      { text: '原单价', value: 'oldPrice', align: 'start' },
      { text: '新单价', value: 'newPrice', align: 'start' },
      { text: '计价单位', value: 'chargeUnit', align: 'start' },
      { text: '原计价数量', value: 'oldChargeNumber', align: 'start' },
      { text: '新计价数量', value: 'newChargeNumber', align: 'start' },
      { text: '变更状态', value: 'status', align: 'start' },
      { text: '创建时间', value: 'createTime', align: 'start' }
    ],
    history: [],
    value: []
  }),
  created () {
    let _this = this
    restAPI.getRestLink(`changeHistory/search/byOrderId?orderId=${this.item.id}`)
      .then(res => {
        res.data.content.some(value => {
          value.procurementMaterial = _this._.find(_this.procurementMaterial, { id: value.procurementMaterialId })
          this.history.push(value)
          this.value.push(value)
        })
      })
  },
  watch: {
    id (val) {
      this.value = this._.filter(this.history, { procurementMaterialId: val })
    }
  },
  methods: {
    formatApprovalStatus (status) {
      if (!status) return
      return this._.find(approvalStatusSelect, { value: status }).name
    },
    handleClose () {
      this.show = false
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
