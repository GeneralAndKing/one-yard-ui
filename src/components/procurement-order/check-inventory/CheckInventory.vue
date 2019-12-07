<template lang="pug">
  #check-inventory
    v-dialog(v-model="show", max-width="350px")
      v-card
        v-card-title.headline
          span.title 库存查询
          v-spacer
          v-btn(text, color="error", icon, @click="show = false")
            v-icon mdi-close
        v-card-text
          v-autocomplete(v-model="select" ,label="物料名称", :items="material",
            autofocus, item-text="name", return-object)
          p 库存数量：{{select.number}}
        v-card-actions
          v-spacer
          v-btn(outlined, color="success", @click="show = false") 关闭
</template>

<script>

export default {
  name: 'CheckInventory',
  props: {
    material: { type: Array, required: true }
  },
  data: () => ({
    show: false,
    select: {}
  })
}
</script>

<style scoped lang="stylus">

</style>
