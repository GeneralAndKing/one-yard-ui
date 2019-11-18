<template lang="pug">
  center-card#one-register
    v-card#form-card.px-6.pb-7.px-sm-10.pb-sm-9.mx-auto(outlined, :loading="loading")
      v-spacer.pt-6.pt-sm-12
      v-card-title.headline.px-0 {{infoText}}
      template(v-if="window === 1")
        p 输入我们发送至 {{account.email}} 的验证码。如果您没有看到此验证码，请检查您的“垃圾邮件”文件夹。
      v-spacer
      v-window(v-model="window")
        v-window-item(:key="0")
          v-card-text.px-0
            v-form(ref="account")
                v-text-field(label="用户名", ref="username", type="text", outlined, counter="18", dense, validate-on-blur,
                  :rules="rules.union(rules.required('用户名'),rules.maxLength(18))" v-model="account.username", @blur="handleExist('username')", autofocus)
                  template(v-slot:append)
                    v-progress-circular(v-if="load.username", size="24", color="info", indeterminate)
                v-text-field(label="电子邮件地址", ref="email", type="email", outlined, counter="25", validate-on-blur,
                  hint="将作为验证您帐号的唯一标准", dense, :rules="rules.email" v-model="account.email", @blur="handleExist('email')")
                  template(v-slot:append)
                    v-progress-circular(v-if="load.email", size="24", color="info", indeterminate)
                v-text-field(label="手机号", ref="phone", type="text", outlined, hint="请输入 11 位的手机号码", validate-on-blur,
                  counter="11", dense, :rules="rules.phone" v-model="account.phone", @blur="handleExist('phone')")
                  template(v-slot:append)
                    v-progress-circular(v-if="load.phone", size="24", color="info", indeterminate)
                v-text-field(label="密码", ref="password", type="password", outlined, counter="18", validate-on-blur,
                  hint="使用 8 个或更多字符（字母、数字和符号的组合）", dense, :rules="rules.password" v-model="account.password")
                v-text-field(label="确认密码", ref="rePassword", type="password", outlined, counter="18", @keyup.enter="next",
                  hint="使用 8 个或更多字符（字母、数字和符号的组合）", dense, :rules="rules.union(rules.password,rules.rePassword)" v-model="account.rePassword")
        v-window-item(:key="1")
          v-card-text.px-0
            v-text-field(label="输入验证码", ref="code", type="text", outlined, v-model="account.code", counter="4" :rules="rules.code", @keyup.enter="next")
      v-card-actions.px-0
        v-btn(text, color="primary", @click="previous") {{preBtnText}}
        v-spacer
        v-btn(color="primary", @click="next") {{nextBtnText}}
      v-footer#form-footer.grey--text @ 2019 copy right
</template>

<script>
import * as oauthAPI from '_api/oauth'
import CenterCard from '_c/center-card/CenterCard'
import { emailRules, passwordRules, requiredRules, phoneRules, codeRules, unionRules, maxLengthRules } from '_u/rule'
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
  data () {
    return {
      window: 0,
      infoText: '创建您的帐号',
      preBtnText: '登录现有帐号',
      nextBtnText: '下一步',
      loading: false,
      load: {
        username: false,
        phone: false,
        email: false
      },
      account: {
        username: null,
        password: null,
        rePassword: null,
        phone: null,
        code: null,
        email: null
      },
      rules: {
        union: unionRules,
        email: emailRules,
        required: requiredRules,
        password: passwordRules,
        phone: phoneRules,
        code: codeRules,
        rePassword: (val) => {
          if (this.account.password !== val) {
            return '两次密码不相同'
          }
          return true
        },
        maxLength: maxLengthRules
      }
    }
  },
  methods: {
    next () {
      if (this.window === 0) {
        if (this.$refs.account.validate(true)) {
          this.loading = true
          oauthAPI.authRegisterEmail(this.account)
            .then(() => { this.window = this.window + 1 })
            .finally(() => { this.loading = false })
        }
      } else if (this.window === 1) {
        this.loading = true
        if (this.$refs.code.validate(true)) {
          oauthAPI.authRegister(this.account)
            .then(() => { this.$router.push({ name: 'login' }) })
            .finally(() => { this.loading = false })
        }
      }
    },
    previous () {
      if (this.window === 0) {
        this.$router.push({ name: 'login' })
      } else if (this.window === 1) {
        this.$refs['code'].reset()
        this.window -= 1
      }
    },
    handleExist (action) {
      if (!this.account[action]) return
      this.load[action] = true
      oauthAPI.authExist({
        username: this.account[action],
        email: this.account[action],
        phone: this.account[action],
        action: action
      }).then(res => {
        if (res.data) this.$refs[action].errorBucket = ['账户已存在，请重新输入']
      }).finally(() => { this.load[action] = false })
    }
  }
}
</script>

<style scoped lang="stylus">
@import "../form.styl"

</style>
