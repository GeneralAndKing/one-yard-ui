<template lang="pug">
  center-card#one-register
    v-card#form-card.px-6.pt-6.pb-7.px-sm-10.pt-sm-12.pb-sm-9.mx-auto(outlined)
      v-spacer
      v-card-title.headline.px-0 {{window === 0 ? "创建您的帐号" : "验证您的电子邮件地址"}}
      div(v-if="window === 1")
        p 输入我们发送至 lizhongyue248@163.com 的验证码。如果您没有看到此验证码，请检查您的“垃圾邮件”文件夹。
      v-spacer
      v-window(v-model="window")
        v-window-item(:key="0")
          v-card-text.px-0
            v-text-field(label="用户名", name="username", type="text", outlined, counter="15", dense)
            v-text-field(label="电子邮件地址", name="email", type="email", outlined, counter="25", hint="将作为验证您帐号的唯一标准", dense)
            v-text-field(label="手机号", name="username", type="text", outlined, hint="请输入 11 位的手机号码", counter="11", dense)
            v-text-field(label="密码", name="password", type="password", outlined, counter="18", hint="使用 8 个或更多字符（字母、数字和符号的组合）", dense)
            v-text-field(label="确认密码", name="rePassword", type="password", outlined, counter="18", hint="使用 8 个或更多字符（字母、数字和符号的组合）", dense)
        v-window-item(:key="1")
          v-card-text.px-0
            v-text-field(label="输入验证码", name="code", type="text", outlined, counter="4")
      v-card-actions.px-0
        a(v-if="window === 0", @click="handleLogin") 登录现有帐号
        a(v-else, @click="previous") 后退
        v-spacer
        v-btn(color="primary", @click="next") 下一步
      v-footer#form-footer.grey--text @ 2019 copy right
</template>

<script>
import CenterCard from '_c/center-card/CenterCard'

export default {
  name: 'Register',
  components: {
    CenterCard
  },
  data: () => ({
    window: 0
  }),
  methods: {
    next () {
      this.window = this.window + 1
    },
    previous () {
      this.window = this.window - 1
    },
    handleLogin () {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>

<style scoped lang="stylus">
@import "form.styl"

</style>
