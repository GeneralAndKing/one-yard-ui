<template lang="pug">
  center-card#one-login
    v-card#form-card.px-6.pt-6.pb-7.px-sm-10.pt-sm-12.pb-sm-9.mx-auto(outlined)
      v-spacer
      v-card-title.justify-center.headline {{welcomeText}}
      #login-user.pb-2.text-center(style="height:44px")
        v-btn(v-if="window === 1", outlined, rounded, @click="previous") {{user.email}}
      v-spacer
      v-card-subtitle.text-center.subtitle-1.pt-0 {{infoText}}
      v-spacer
      v-window(v-model="window", style="min-height:180px")
          v-window-item(:key="0")
            v-card-text.px-0
              v-text-field(label="电子邮件地址", name="email", type="text",
                outlined, :rules="rules.email", v-model='user.email', required, clearable ref="username")
          v-window-item(:key="1")
            v-card-text.px-0
              v-text-field(label="输入您的密码", name="password", type="password",
                outlined, :rules="rules.password", v-model='user.password' ref="password")
      v-card-actions.px-0
        a(@click="handleAccount") {{accountText}}
        v-spacer
        v-btn(color="primary", @click="next") {{nextBtnText}}
      v-footer#form-footer.grey--text @ 2019 copy right
</template>

<script>
import CenterCard from '_c/center-card/CenterCard'
import { emailRules, passwordRules } from '_u/rules'
export default {
  name: 'Login',
  components: {
    CenterCard
  },
  data () {
    return { window: 0,
      user: {
        email: '',
        password: '',
        name: 'John Doe'
      },
      rules: {
        email: emailRules,
        password: passwordRules
      },
      nextBtnText: '下一步',
      accountText: '创建账号',
      welcomeText: '登陆',
      infoText: '使用您的帐号进行登录'
    }
  },
  watch: {
    window: function (val) {
      if (val === 0) {
        this.welcomeText = '登陆'
        this.infoText = '使用您的帐号进行登录'
        this.nextBtnText = '下一步'
        this.accountText = '创建账号'
      } else if (val === 1) {
        this.welcomeText = '欢迎'
        this.nextBtnText = '登陆'
        this.accountText = '忘记密码?'
        this.infoText = '要继续操作，请首先验证登录者是您本人'
      }
    }
  },
  created () {
    this.$vuetify.theme.dark = false
  },
  methods: {
    handleAccount () {
      if (this.window === 1) {
        this.$router.push({ path: '/forget' })
      } else {
        this.$router.push({ path: '/register' })
      }
    },
    next () {
      // 如果windows===1那么登陆
      if (this.window === 1) {
        if (this.$refs['username'].validate(true) && this.$refs['password'].validate(true)) {
          this.$router.push({ path: '/home' })
        }
      } else {
        if (this.$refs['username'].validate(true)) {
          this.window += 1
        }
      }
    },
    previous () {
      this.$refs['password'].reset()
      this.window -= 1
    }
  }
}
</script>

<style scoped lang="stylus">
@import "form.styl"
</style>
