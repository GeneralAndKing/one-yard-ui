<template lang="pug">
  center-card#one-login
    v-card#form-card.px-6.pt-6.pb-7.px-sm-10.pt-sm-12.pb-sm-9.mx-auto(outlined)
      v-spacer
      v-card-title.justify-center.headline {{window === 0 ? "登录" : "欢迎"}}
      #login-user.pb-2.text-center
        v-btn(v-if="window === 1", outlined, rounded, @click="previous") lizhongyue248@163.com
      v-spacer
      v-card-subtitle.text-center.subtitle-1.pt-0 {{window === 0 ? "使用您的帐号进行登录" : "要继续操作，请首先验证登录者是您本人"}}
      v-spacer
      v-window(v-model="window")
        v-window-item(:key="0")
          v-card-text.px-0
            v-text-field(label="电子邮件地址或手机号", name="username", type="text", outlined)
            a 忘记了电子邮件地址？
        v-window-item(:key="1")
          v-card-text.px-0
            v-text-field(label="输入您的密码", name="password", type="password", outlined)
      v-card-actions.px-0
        a(v-if="window === 0", @click="handleCreate") 创建帐号
        a(v-else) 忘记了密码？
        v-spacer
        v-btn(color="primary", @click="next") 下一步
      v-footer#form-footer.grey--text @ 2019 copy right
</template>

<script>
import CenterCard from '_c/center-card/CenterCard'

export default {
  name: 'Login',
  components: {
    CenterCard
  },
  data: () => ({
    window: 0,
    user: {
      // email: 'admin@example.com',
      // password: 'admin',
      // name: 'John Doe',
    }
  }),
  created () {
    this.$vuetify.theme.dark = false
  },
  methods: {
    next () {
      this.window = this.window + 1
    },
    previous () {
      this.window = this.window - 1
    },
    handleCreate () {
      this.$router.push({ path: '/register' })
    }
  }
}
</script>

<style scoped lang="stylus">
@import "form.styl"
</style>
