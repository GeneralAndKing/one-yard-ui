<template lang="pug">
    v-content#one-error
      v-responsive.fill-height.mx-auto(max-width="1024px")
        v-container.fill-height
          v-layout(align-center, justify-center)
            v-flex.text-center
              h1.display-1.blue--text {{text}} {{code}}
              p.mt-2 ~~~
              v-btn(outlined, color="primary", @click="handleBack") 点击返回
</template>

<script>
export default {
  name: 'error',
  data: () => ({
    text: '未知错误',
    code: 500
  }),
  created () {
    if (this.$route.query.text !== undefined) this.text = this.$route.query.text
    if (this.$route.query.code !== undefined) this.code = this.$route.query.code
  },
  methods: {
    handleBack () {
      this.$router.back()
    }
  }
}
</script>
