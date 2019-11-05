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
              v-text-field(label="电子邮件地址", ref="email", type="text",
                outlined, :rules="rules.email", v-model='email', required, clearable)
          v-window-item(:key="1")
            v-card-text.px-0
              v-text-field(label="输入您的验证码", ref="code", type="text",
                outlined, :rules="rules.code", v-model='code', counter='4')
          v-window-item(:key="2")
            v-card-text.px-0
              v-text-field(label="输入您的新密码", ref="password", type="password", dense,
                outlined, :rules="rules.password", v-model='password', counter='18')
              v-text-field(label="确认您的新密码", ref="rePassword", type="password", dense,
                outlined, :rules="rules.union(rules.password,rules.rePassword)", v-model='rePassword', counter='18')
      v-card-actions.px-0
        a(@click="handleAccount") {{accountText}}
        v-spacer
        v-btn(color="primary", @click="next") {{nextBtnText}}
      v-footer#form-footer.grey--text @ 2019 copy right
</template>

<script>
import CenterCard from '_c/center-card/CenterCard'
import { emailRules, passwordRules, codeRules, unionRules } from '_u/rules'
export default {
  name: 'Forget',
  components: {
    CenterCard
  },
  data () {
    return { window: 0,
      email: '',
      code: '',
      password: '',
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
  },
  methods: {
    handleAccount () {
      if (this.window === 0) {
        this.$router.push({ name: 'login' })
      } else if (this.window === 1) {
        // to do 重新发送
        console.log('重新发送')
      } else {
        this.previous()
      }
    },
    next () {
      // 如果windows===1那么登陆
      if (this.window === 0) {
        if (this.$refs['email'].validate(true)) {
          this.window += 1
        }
      } else if (this.window === 1) {
        if (this.$refs['code'].validate(true)) {
          // to do 验证码是否正确
          this.window += 1
        }
      } else if (this.window === 2) {
        if (this.$refs['form'].validate(true)) {
          // to do 密码修改成功
          this.$router.push({ name: 'home' })
        }
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
  @import "form.styl"
</style>
