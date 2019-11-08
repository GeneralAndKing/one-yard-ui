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
                        v-text-field(label="电子邮件地址", name="email", type="text", validate-on-blur,
                            outlined, :rules="rules.email", v-model='user.email', required, clearable,
                            ref="email", autofocus)
                v-window-item(:key="1")
                    v-card-text.px-0
                        v-text-field(label="输入您的密码", name="password", type="password", autofocus, validate-on-blur,
                            outlined, :rules="rules.password", v-model='user.password', ref="password")
            v-card-actions.px-0
                v-btn(text, color="primary", @click="handleAccount") {{accountText}}
                v-spacer
                v-btn(color="primary", @click="next") {{nextBtnText}}
            v-footer#form-footer.grey--text @ 2019 copy right
</template>

<script>
import CenterCard from '_c/center-card/CenterCard'
import { emailRules, passwordRules } from '_u/rules'
import * as oauthAPI from '_api/oauth'

export default {
  name: 'Login',
  components: {
    CenterCard
  },
  data () {
    return {
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
  },
  methods: {
    handleAccount () {
      if (this.window === 1) {
        this.$router.push({ name: 'forget' })
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
          console.log('asd')
          try {
            await _this.$store.dispatch('auth/oauthLogin', {
              username: _this.user.email,
              password: _this.user.password,
              grant_type: 'password',
              scope: 'all'
            })
            await _this.$store.dispatch('auth/checkToken', _this.$store.getters['auth/token'])
            _this.$router.push({ name: 'home' })
          } catch (e) {
            console.log(e)
            _this.$refs['password'].errorBucket = e.data.hasOwnProperty('error_description') ? [e.data.error_description] : ['验证失败']
          } finally {
            _this.load = false
          }
        }
      } else {
        if (this.$refs['email'].validate(true)) {
          this.load = true
          try {
            let res = await oauthAPI.authExistEmail(_this.user)
            if (res.data) _this.window += 1
            else this.$refs['email'].errorBucket = ['账户不存在，请重新输入']
          } catch (e) {
            console.log(e)
            _this.$refs['email'].errorBucket = e.data.hasOwnProperty('error_description') ? [e.data.error_description] : ['验证失败']
          } finally {
            _this.load = false
          }
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
</style>
