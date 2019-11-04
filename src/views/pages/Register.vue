<template lang="pug">
  center-card#one-register
    v-card#form-card.px-6.pt-6.pb-7.px-sm-10.pt-sm-12.pb-sm-9.mx-auto(outlined)
      v-spacer
      v-card-title.headline.px-0 {{infoText}}
      template(v-if="window === 1")
        p 输入我们发送至 {{account.email}} 的验证码。如果您没有看到此验证码，请检查您的“垃圾邮件”文件夹。
      v-spacer
      v-window(v-model="window")
        v-window-item(:key="0")
          v-card-text.px-0
            v-form(ref="account")
                v-text-field(label="用户名", ref="username", type="text", outlined, counter="15", dense :rules="rules.required" v-model="account.username")
                v-text-field(label="电子邮件地址", ref="email", type="email", outlined, counter="25", hint="将作为验证您帐号的唯一标准", dense :rules="rules.email" v-model="account.email")
                v-text-field(label="手机号", ref="phone", type="text", outlined, hint="请输入 11 位的手机号码", counter="11", dense :rules="rules.phone" v-model="account.phone")
                v-text-field(label="密码", ref="password", type="password", outlined, counter="18", hint="使用 8 个或更多字符（字母、数字和符号的组合）", dense :rules="rules.password" v-model="account.password")
                v-text-field(label="确认密码", ref="rePassword", type="password", outlined, counter="18", hint="使用 8 个或更多字符（字母、数字和符号的组合）", dense :rules="_.union([rePasswordRule] ,rules.password)" v-model="account.rePassword")
        v-window-item(:key="1")
          v-card-text.px-0
            v-text-field(label="输入验证码", ref="code", type="text", outlined, counter="4" :rules="rules.code")
      v-card-actions.px-0
        a(@click="previous") {{preBtnText}}
        v-spacer
        v-btn(color="primary", @click="next") {{nextBtnText}}
      v-footer#form-footer.grey--text @ 2019 copy right
</template>

<script>
import CenterCard from '_c/center-card/CenterCard'
import { emailRules, passwordRules, requiredRules, phoneRules, codeRules } from '_u/rules'
export default {
  name: 'Register',
  components: {
    CenterCard
  },
  watch: {
    window: function (val) {
      if (val === 0) {
        this.infoText = '创建您的帐号'
        this.preBtnText = '登录现有帐号'
        this.nextBtnText = '下一步'
      } else if (val === 1) {
        this.infoText = '验证您的电子邮件地址'
        this.preBtnText = '后退'
        this.nextBtnText = '注册'
      }
    }
  },
  data: () => ({
    window: 0,
    infoText: '创建您的帐号',
    preBtnText: '登录现有帐号',
    nextBtnText: '下一步',
    account: {
      username: null,
      password: null,
      rePassword: null,
      phone: null,
      email: null
    },
    rules: {
      email: emailRules,
      required: requiredRules,
      password: passwordRules,
      phone: phoneRules,
      code: codeRules
    }
  }),
  methods: {
    rePasswordRule (val) {
      if (this.account.password !== val) {
        return '两次密码不相同'
      }
      return true
    },
    next () {
      if (this.window === 0) {
        if (this.$refs.account.validate(true)) {
          // to do
          this.window = this.window + 1
        }
      } else if (this.window === 1) {
        if (this.$refs['code'].validate(true)) {
          // to do
        }
      }
    },
    previous () {
      if (this.window === 0) {
        this.$router.push({ path: '/login' })
      } else if (this.window === 1) {
        this.$refs['code'].reset()
        this.window -= 1
        // to do
      }
    }
  }
}
</script>

<style scoped lang="stylus">
@import "form.styl"

</style>
