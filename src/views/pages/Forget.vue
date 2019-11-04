<template lang="pug">
  center-card#one-forget
    v-card#form-card.px-6.pt-6.pb-7.px-sm-10.pt-sm-12.pb-sm-9.mx-auto(outlined)
      v-spacer
      v-card-title.justify-center.headline {{welcomeText}}
      #login-user.pb-2.text-center(style="height:44px")
        v-btn(v-if="window === 1", outlined, rounded, @click="previous") {{email}}
      v-spacer
      v-card-subtitle.text-center.subtitle-1.pt-0 {{infoText}}
      v-spacer
      v-window(v-model="window", style="min-height:180px")
        v-form(ref='form')
          v-window-item(:key="0")
            v-card-text.px-0
              v-text-field(label="电子邮件地址", name="email", type="text",
                outlined, :rules="emailRules", v-model='email', required, clearable)
          v-window-item(:key="1")
            v-card-text.px-0
              v-text-field(label="输入您的验证码", name="code", type="text",
                outlined, :rules="codeRules", v-model='code', counter='4')
          v-window-item(:key="2")
            v-card-text.px-0
              v-text-field(label="输入您的新密码", name="password", type="password", dense,
                outlined, :rules="passwordRules", v-model='password', counter='18')
              v-text-field(label="确认您的新密码", name="rePassword", type="password", dense,
                outlined, :rules="passwordRules", v-model='rePassword', counter='18')
      v-card-actions.px-0
        a(@click="handleAccount") {{accountText}}
        v-spacer
        v-btn(color="primary", @click="next") {{loginText}}
      v-footer#form-footer.grey--text @ 2019 copy right
</template>

<script>
import CenterCard from '_c/center-card/CenterCard'

export default {
  name: 'Forget',
  components: {
    CenterCard
  },
  data: () => ({
    window: 0,
    email: '',
    code: '',
    password: '',
    rePassword: '',
    emailRules: [
      v => !!v || '账号不能为空',
      v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || '电子邮箱不规范'
    ],
    codeRules: [
      v => !!v || '验证码不能为空'
    ],
    passwordRules: [
      v => !!v || '密码不能为空'
    ],
    loginText: '下一步',
    accountText: '登录帐号',
    welcomeText: '找回您的密码',
    infoText: '请输入您的电子邮件地址以找回密码'
  }),
  watch: {
    window: function (val) {
      if (val === 0) {
        this.welcomeText = '找回您的密码'
        this.infoText = '使用您的帐号进行登录'
        this.loginText = '下一步'
        this.accountText = '登录帐号'
      } else if (val === 1) {
        this.welcomeText = '验证您的帐号'
        this.infoText = '请输入您收到的验证码'
        this.loginText = '下一步'
        this.accountText = '没有收到？重新发送'
      } else if (val === 2) {
        this.welcomeText = '设置您的新密码'
        this.infoText = '请输入并牢记您的新密码'
        this.loginText = '完成'
        this.accountText = '后退'
      }
    }
  },
  created () {
    this.$vuetify.theme.dark = false
  },
  methods: {
    handleAccount () {
      if (this.window === 1) {
        console.log('重新发送')
      } else if (this.window === 0) {
        this.$router.push({ path: '/login' })
      } else {
        this.previous()
      }
    },
    next () {
      // 如果windows===1那么登陆
      if (this.window === 0) {
        if (this.$refs.form.validate('email')) {
          this.window += 1
        }
      } else if (this.window === 1) {
        if (this.$refs.form.validate()) {
          this.window += 1
        }
      } else {
        this.$router.push({ path: '/home' })
      }
    },
    previous () {
      this.window -= 1
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "form.styl"
</style>
