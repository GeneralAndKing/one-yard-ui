<template lang="pug">
    v-content#one-error
      v-responsive.fill-height.mx-auto(max-width="1024px")
        v-container.fill-height
          v-layout(align-center, justify-center)
            v-flex.text-center
              h1.display-1.blue--text 哎呀，出错了！ 404
              p.mt-2 你访问的页面不存在哦～
              v-btn(outlined, color="primary", @click="handleBack") 点击返回
</template>

<script>
export default {
  name: 'error',
  data: () => ({
  }),
  methods: {
    handleBack () {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>
