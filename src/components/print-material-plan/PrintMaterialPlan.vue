<template lang="pug">
    div(ref='print')
        a(v-show='false') asdasd
        v-btn(@click="print") asf
</template>

<script>

export default {
  name: 'PrintMaterialPlan',
  props: {
  },
  methods: {
    print () {
      this.$print(this.$refs.print)
    }
  }
}
</script>
