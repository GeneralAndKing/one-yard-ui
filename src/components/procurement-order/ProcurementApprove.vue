<template lang="pug">
  .procurement-approve
    v-timeline.mr-3(dense)
      v-timeline-item(v-for="a in approve", :key="a.id", large, right)
        template(v-slot:icon)
          v-avatar
            img(src="http://i.pravatar.cc/64")
        template(v-slot:opposite)
          span {{a.createUser}}
        v-card.elevation-2
          v-card-title {{a.result}}
          v-card-text(style="font-size:19px") {{a.description}}
          v-card-actions
            v-spacer
            span.grey--text.pa-3 审批人:{{a.createUser}} 审批时间：{{a.createTime}}

</template>

<script>

export default {
  name: 'ProcurementApprove',
  props: {
    approve: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    //
  })
}
</script>

<style scoped lang="stylus">

</style>
