<template lang="pug">
  v-container.skeleton-loader(grid-list-md)
    v-row
      v-col(cols="12")
        v-skeleton-loader(type="heading")
      v-col(cols="12", :md="md", :lg="lg", v-for="i in num", :key="i")
        v-skeleton-loader(type="card-heading")
      v-col(cols="12")
        v-skeleton-loader(type="heading")
      v-col(cols="12")
        v-skeleton-loader(type="table")
</template>

<script>

export default {
  name: 'SkeletonLoader',
  props: {
    md: { type: Number, default: 6 },
    lg: { type: Number, default: 4 },
    num: { type: Number, default: 6 }
  },
  data: () => ({
    //
  })
}
</script>

<style scoped lang="stylus">

</style>
