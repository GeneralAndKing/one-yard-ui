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
          v-data-table(:headers="headers", :items="history")
            template(v-slot:item.materialName="{ item }")
              span {{item.material.name}}
</template>

<script>
export default {
  name: 'ChangeHistory',
  props: {
    materials: {
      type: Array,
      required: true
    }
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
      { text: '变更状态', value: 'status', align: 'start' }
    ],
    history: []
  }),
  created () {
    for (let i = 1; i < 5; i++) {
      this.history.push({
        // TODO:初始化信息，需要通过 materialId 查询到对应的 material
        material: { name: `物料${i}` },
        oldNumber: i,
        newNumber: i,
        oldPrice: 1,
        newPrice: 1,
        chargeUnit: '个',
        oldChargeNumber: i,
        newChargeNumber: i,
        status: i % 2 === 1 ? '待审批' : '审批通过'
      })
    }
  },
  methods: {
    handleClose () {
      this.show = false
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
