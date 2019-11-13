<template lang="pug">
  v-container#one-user-setting.mt-9
    v-layout(wrap, justify-center)
      v-flex.pa-2(xs12, md8)
        v-card.mt-5.mb-3
          v-card-text
            table-card-sheet(title="个人设置", description="您可以在这里设置或更改您的个人信息",
              :color="$store.getters['sundry/theme'] ? 'orange' : 'green'")
            v-form(ref="user").pt-6
              v-container(grid-list-md)
                v-layout(wrap)
                  v-flex(xs12, sm6, md6)
                    v-text-field(v-model="me.username", counter="18", label="用户名", validate-on-blur, :readonly='!edit'
                      :rules="rules.union(rules.required('用户名'))", ref="username", @blur="handleExist('username')")
                      template(v-slot:append)
                        v-progress-circular(v-if="load.username", size="24", color="info", indeterminate)
                  v-flex(xs12, sm6, md6)
                    v-text-field(v-model="me.name", counter="18", label="姓名", validate-on-blur, :readonly='!edit'
                      :rules="rules.union(rules.required('姓名'))", ref="name")
                  v-flex(xs12, sm6, md6)
                    v-text-field(type="email", v-model="me.email", counter="30", hint="可能用于找回密码", validate-on-blur,
                      label="电子邮箱" :rules="rules.email", ref="email", @blur="handleExist('email')", readonly)
                  v-flex(xs12, sm6, md6)
                    v-text-field(type="phone", v-model="me.phone", counter="11", hint="长度为11位的手机号", validate-on-blur,
                      label="手机号", :rules="rules.phone", @blur="handleExist('phone')", ref="phone", :readonly='!edit')
                  v-flex(xs12, sm12)
                    v-textarea(label="备注", v-model="me.remark", counter="250", :readonly='!edit')
          v-card-actions.justify-end
            v-btn(v-if="edit", text, color="error", @click="handleCancel") 取消
            v-btn(text, :color="edit ? 'success' : 'primary'", @click="handleSubmit") {{edit ? '保存' : '编辑' }}
      v-flex.pa-2(xs12, md4)
        v-card.mt-5.mb-3
          .one-avatar.text-center
            v-avatar.mx-auto.one-avatar-img.elevation-18(height="130px", width="130px")
              img(src="https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg")
          v-card-text
            v-container(grid-list-md)
              v-layout(wrap)
                v-flex(xs12, sm12)
                  v-text-field(type="password", v-model="passwords.oldPassword", counter="18", label="旧密码", validate-on-blur,
                    :rules="rules.password", ref="password")
                v-flex(xs12, sm12)
                  v-text-field(type="password", v-model="passwords.newPassword", counter="18", label="新密码", validate-on-blur,
                    :rules="rules.password", ref="password")
                v-flex(xs12, sm12)
                  v-text-field(type="password", v-model="passwords.rePassword", counter="18", label="重复密码", validate-on-blur,
                    :rules="rules.password", ref="password")
          v-card-actions.justify-end
            v-btn(text, color="orange") 修改密码

</template>

<script>
import TableCardSheet from '_c/table-card-sheet'
import * as oauthAPI from '_api/oauth'
import { emailRules, passwordRules, requiredRules, unionRules, phoneRules, imageRequiredRules } from '_u/rule'
export default {
  name: 'UserSetting',
  components: {
    TableCardSheet
  },
  data: () => ({
    me: {},
    load: {
      username: false,
      phone: false,
      email: false
    },
    passwords: {
      oldPassword: '',
      newPassword: '',
      rePassword: ''
    },
    edit: false,
    editUser: {},
    rules: {
      email: emailRules,
      password: passwordRules,
      required: requiredRules,
      union: unionRules,
      phone: phoneRules,
      image: imageRequiredRules
    }
  }),
  created () {
    this.me = this.$store.getters['auth/me']
  },
  methods: {
    handleExist (action) {
      if (!this.me[action] || !this.edit) return
      this.load[action] = true
      oauthAPI.authExist({
        username: this.me[action],
        email: this.me[action],
        phone: this.me[action],
        action: action
      }).then(res => {
        if (res.data) this.$refs[action].errorBucket = ['账户已存在，请重新输入']
      }).finally(() => { this.load[action] = false })
    },
    handleSubmit () {
      if (this.edit) {
        // 此时是保存，保存数据成功以后，回调
        this.edit = false
      } else {
        // 此时是编辑，把原数据保存一下点击取消的时候可以恢复
        this.editUser = this._.cloneDeep(this.me)
        this.edit = true
      }
    },
    handleCancel () {
      this.me = this._.cloneDeep(this.editUser)
      this.edit = false
    }
  }
}
</script>

<style scoped lang="stylus">
.one-avatar
  top -54px
  position relative
.one-avatar-img
  img
    transition transform 1s ease-in
    &:hover
      -moz-transform rotate(360deg)
      -o-transform rotate(360deg)
      -webkit-transform rotate(360deg)
      transform rotate(360deg)
</style>
