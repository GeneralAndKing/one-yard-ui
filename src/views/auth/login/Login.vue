<template lang="pug">
  center-card#one-login
    v-card#form-card.px-6.pb-7.px-sm-10.pb-sm-9.mx-auto(outlined, :loading="load")
      v-spacer.pt-6.pt-sm-12
      v-card-title.justify-center.headline {{welcomeText}}
      #login-user.pb-2.text-center(style="height:44px")
        v-btn(v-if="window === 1", outlined, rounded, @click="previous") {{user.email}}
      v-spacer
      v-card-subtitle.text-center.subtitle-1.pt-0 {{infoText}}
      v-spacer
      v-window(v-model="window", style="min-height:180px")
        v-window-item(:key="0")
          v-card-text.px-0
            v-text-field(label="电子邮件地址", name="email", type="text", required, clearable,
              outlined, :rules="rules.email", v-model='user.email', @keyup.enter="next",
              ref="email", autofocus)
        v-window-item(:key="1")
          v-card-text.px-0
            v-text-field(label="输入您的密码", name="password", type="password", autofocus,
              outlined, :rules="rules.password", v-model='user.password', ref="password", @keyup.enter="next")
      v-card-actions.px-0
        v-btn(outlined, color="info", @click="handleAccount") {{accountText}}
        v-spacer
        v-btn(color="info", @click="next") {{nextBtnText}}
      v-footer#form-footer.grey--text @ 2019 copy right by EchoCow Japoul BugRui
</template>

<script>
import CenterCard from '_c/center-card/CenterCard'
import { emailRules, passwordRules } from '_u/rule'
import * as oauthAPI from '_api/oauth'
import { to } from '_u/util'

export default {
  name: 'Login',
  components: {
    CenterCard
  },
  data () {
    return {
      show1: true,
      show2: true,
      window: 0,
      load: false,
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
    this.$message({ content: 'left1', timeout: 1000000, y: 'bottom' })
    this.$message({ content: 'left2', timeout: 10000, y: 'bottom' })
    // this.$message({ content: 'left2', timeout: 10000, x: 'left' })
    // this.$message({ content: 'left2', timeout: 10000, x: 'left' })
    // this.$message({ content: 'left2', timeout: 10000, x: 'left' })
  },
  methods: {
    handleAccount () {
      if (this.window === 1) {
        this.$router.push({ name: 'forget', params: { email: this.user.email } })
      } else {
        this.$router.push({ name: 'register' })
      }
    },
    async next () {
      let _this = this
      // 如果windows===1那么登陆
      if (_this.window === 1) {
        if (_this.$refs['email'].validate(true) && this.$refs['password'].validate(true)) {
          _this.load = true
          try {
            await _this.$store.dispatch('auth/oauthLogin', {
              username: _this.user.email,
              password: _this.user.password,
              grant_type: 'password',
              scope: 'all'
            })
            await _this.$store.dispatch('auth/checkToken')
            await _this.$store.dispatch('auth/getMe')
            await _this.$router.push({ name: 'home' })
          } catch (e) {
            _this.$refs['password'].errorBucket = [_this._.get(e, 'data.error_description', '验证失败')]
          } finally {
            _this.load = false
          }
        }
      } else {
        if (this.$refs['email'].validate(true)) {
          _this.load = true
          let res, err
          [err, res] = await to(oauthAPI.authExistEmail(_this.user))
          if (this._.get(res, 'data', false)) _this.window += 1
          else this.$refs['email'].errorBucket = [_this._.get(err, 'data.error_description', '账户不存在，请重新输入')]
          _this.load = false
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
@import "../form.styl"
.tip
  position fixed
  top 0
  left 10px
  transition all 1s
  .rel
    transition all 1s
    position relative
    margin-bottom 20px
</style>
