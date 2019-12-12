<template lang="pug">
  center-card#one-forget
    v-card#form-card.px-6.pb-7.px-sm-10.pb-sm-9.mx-auto(outlined, :loading="load")
      v-spacer.pt-6.pt-sm-12
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
              v-text-field(label="电子邮件地址", ref="email", type="text", @keyup.enter="next", autofocus,
                outlined, :rules="rules.email", v-model='email', required, clearable)
          v-window-item(:key="1")
            v-card-text.px-0
              v-text-field(label="输入您的验证码", ref="code", type="text", @keyup.enter="next", autofocus,
                outlined, :rules="rules.code", v-model='code', counter='4')
          v-window-item(:key="2")
            v-card-text.px-0
              v-text-field(label="输入您的新密码", ref="password", type="password", dense, validate-on-blur,
                outlined, :rules="rules.password", v-model='password', counter='18', autofocus)
              v-text-field(label="确认您的新密码", ref="rePassword", type="password", dense, validate-on-blur, @keyup.enter="next"
                outlined, :rules="rules.union(rules.password,rules.rePassword)", v-model='rePassword', counter='18')
      v-card-actions.px-0
        div(v-show="window!==2")
          v-btn(outlined, color="info", @click="handleAccount", :disabled="disabled" ) {{accountText}}
        v-spacer
        v-btn(color="info", @click="next") {{nextBtnText}}
      v-footer#form-footer.grey--text @ 2019 copy right
</template>

<script>
import CenterCard from '_c/center-card/CenterCard'
import { emailRules, passwordRules, codeRules, unionRules } from '_u/rule'
import * as oauthAPI from '_api/oauth'

export default {
  name: 'Forget',
  components: {
    CenterCard
  },
  data () {
    return {
      window: 0,
      load: false,
      email: '',
      code: '',
      password: '',
      disabled: false,
      rePassword: '',
      rules: {
        code: codeRules,
        email: emailRules,
        password: passwordRules,
        rePassword: (val) => {
          if (this.password !== val) {
            return '两次密码不相同'
          }
          return true
        },
        union: unionRules
      },
      nextBtnText: '下一步',
      accountText: '登录帐号',
      welcomeText: '找回您的密码',
      infoText: '请输入您的电子邮件地址以找回密码'
    }
  },
  watch: {
    window: function (val) {
      if (val === 0) {
        this.welcomeText = '找回您的密码'
        this.infoText = '使用您的帐号进行登录'
        this.nextBtnText = '下一步'
        this.accountText = '登录帐号'
      } else if (val === 1) {
        this.welcomeText = '验证您的帐号'
        this.infoText = '请输入您收到的验证码'
        this.nextBtnText = '下一步'
        this.accountText = '没有收到？重新发送'
      } else if (val === 2) {
        this.welcomeText = '设置您的新密码'
        this.infoText = '请输入并牢记您的新密码'
        this.nextBtnText = '完成'
        this.accountText = '后退'
      }
    }
  },
  created () {
    this.$vuetify.theme.dark = false
    this.email = this.$route.params.email
  },
  methods: {
    handleAccount () {
      if (this.window === 0) {
        this.$router.push({ name: 'login' })
      } else if (this.window === 1) {
        this.load = true
        let second = 60
        oauthAPI.authForgetEmail({ email: this.email })
          .then(() => {
            this.disabled = true
            const change = setInterval(() => {
              this.accountText = `没有收到？重新发送(${second}s)`
              second -= 1
            }, 1000)
            setTimeout(() => {
              clearInterval(change)
              this.accountText = `没有收到？重新发送`
              this.disabled = false
            }, 60000)
          })
          // .catch(error => { )
          .finally(() => { this.load = false })
      } else {
        this.previous()
      }
    },
    next () {
      let _this = this
      if (this.window === 0 && this.$refs.email.validate(true)) {
        this.load = true
        oauthAPI.authForgetEmail({ email: this.email })
          .then(() => { _this.window += 1 })
          .catch(error => { if (error.status === 404) this.$refs.email.errorBucket = ['账户不存在，请重新输入'] })
          .finally(() => { _this.load = false })
      } else if (this.window === 1 && this.$refs.code.validate(true)) {
        this.load = true
        oauthAPI.authForgetValidate({ email: this.email, code: this.code })
          .then(() => { _this.window += 1 })
          .catch(error => { this.$refs.code.errorBucket = [this._.get(error, 'response.data.error_description', '验证失败')] })
          .finally(() => { _this.load = false })
      } else if (this.window === 2 && this.$refs.form.validate(true)) {
        this.load = true
        oauthAPI.authForget({ email: this.email, code: this.code, password: this.password, rePassword: this.rePassword })
          .then(() => { this.$router.push({ name: 'home' }) })
          .catch(error => { this.$refs.password.errorBucket = [this._.get(error, 'response.data.error_description', '修改失败')] })
          .finally(() => {
            _this.load = false
            _this.$message('密码修改成功', 'success')
          })
      }
    },
    previous () {
      if (this.window === 1) {
        this.$refs['code'].reset()
        this.window -= 1
      } else if (this.window === 2) {
        this.$refs['password'].reset()
        this.$refs['rePassword'].reset()
        this.window -= 1
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../form.styl"
</style>
