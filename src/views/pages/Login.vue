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
            v-text-field(label="电子邮件地址", name="username", type="text", outlined :rules="emailRules" ref="username" v-model='user.email' required)
        v-window-item(:key="1")
          v-card-text.px-0
            v-text-field(label="输入您的密码", name="password", type="password", outlined :rules="passwordRules" ref="password" v-model='user.password')
      v-card-actions.px-0
        a(@click="handleCreate") 创建帐号
        a {{retrieveText}}
        v-spacer
        v-btn(color="primary", @click="next") {{loginText}}
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
      email: '',
      password: '',
      name: 'John Doe'
    },
    emailRules: [
      v => !!v || '账号不能为空',
      v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || '电子邮箱不规范'
    ],
    passwordRules: [
      v => !!v || '密码不能为空'
    ],
    loginText: '下一步',
    retrieveText: '忘记账号?'
  }),
  watch: {
    window: function (val) {
      if (val === 0) {
        this.loginText = '下一步'
        this.retrieveText = '忘记账号?'
      } else if (val === 1) {
        this.loginText = '登陆'
        this.retrieveText = '忘记密码?'
      }
    }
  },
  created () {
    this.$vuetify.theme.dark = false
  },
  methods: {
    handleCreate () {
      this.$router.push({ path: '/register' })
    },
    next () {
      // 如果windows===1那么登陆
      if (this.window === 1) {
        if (this.$refs.password.validate() && this.$refs.username.validate()) {
          this.$router.push({ path: '/index' })
        }
      } else {
        console.log(this.$refs.username)
        if (this.$refs.username.validate()) {
          this.window += 1
        }
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
