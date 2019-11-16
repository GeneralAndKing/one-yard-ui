<template lang="pug">
  v-container
    v-card
      v-card-title
      v-card-text
</template>

<script>

export default {
  name: 'PrintProcurementPlan',
  props: {
    procurementPlan: Object
  }
}
</script>
