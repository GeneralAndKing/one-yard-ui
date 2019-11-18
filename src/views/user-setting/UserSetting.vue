<template lang="pug">
  v-container#one-user-setting.mt-9
    v-layout(wrap, justify-center)
      v-flex.pa-2(xs12, md8)
        v-card.mt-5.mb-3
          v-card-text
            table-card-sheet(title="个人设置", description="您可以在这里设置或更改您的个人信息，并通过右上角刷新按钮实时更新您的数据。",
              :color="$store.getters['sundry/theme'] ? 'orange' : 'green'")
            v-form(ref="user").pt-6
              v-container(grid-list-md)
                v-layout(wrap)
                  v-flex(xs12, sm6, md6)
                    v-text-field(type="email", v-model="me.email", counter="30", hint="可能用于找回密码", validate-on-blur,
                      label="电子邮箱" :rules="rules.email", ref="email",  disabled)
                  v-flex(xs12, sm6, md6)
                    v-text-field(v-model="me.username", counter="18", label="用户名", validate-on-blur,  disabled,
                      :rules="rules.union(rules.required('用户名'))", ref="username", @blur="handleExist('username')")
                      template(v-slot:append)
                        v-progress-circular(v-if="load.username", size="24", color="info", indeterminate)
                  v-flex(xs12, sm6, md6)
                    v-text-field(v-model="me.name", counter="18", label="姓名", validate-on-blur, :disabled='!edit'
                      :rules="rules.union(rules.required('姓名'))", ref="name")
                  v-flex(xs12, sm6, md6)
                    v-text-field(type="phone", v-model="me.phone", counter="11", hint="长度为11位的手机号", validate-on-blur,
                      label="手机号", :rules="rules.phone", @blur="handleExist('phone')", ref="phone", :disabled='!edit')
                  v-flex(xs12, sm12)
                    v-textarea(label="备注", v-model="me.remark", counter="250", :disabled='!edit')
          v-card-actions.justify-end
            v-btn(v-if="edit", text, color="error", @click="handleCancel") 取消
            v-btn(text, :color="edit ? 'success' : 'primary'", @click="handleSubmit", :loading='loading.left') {{edit ? '保存' : '编辑' }}
      v-flex.pa-2(xs12, md4)
        v-card.mt-5.mb-3
          .one-avatar.text-center
            v-avatar.mx-auto.one-avatar-img.elevation-18(height="130px", width="130px")
              v-img(:src="me.icon", lazy-src="http://q0zlaui5t.bkt.clouddn.com/oneYard/avatar/d244472f-70b7-4a66-9a4e-de39cff10195")
          v-flex.text-center(xs12, sm12)
            v-btn(color="light-blue", dark, @click="handleUpload", :loading="loading.upload") 上传头像
            v-file-input.d-none(accept="image/*", label="上传头像", prepend-icon="", ref="icon", @change="uploadAvatar")
          v-card-text
            v-form(ref="password")
              v-container(grid-list-md)
                v-layout(wrap)
                  v-flex(xs12, sm12)
                    v-text-field(type="password", v-model="passwords.oldPassword", counter="18", label="旧密码", validate-on-blur,
                      :rules="rules.password", :disabled='!editPassword')
                  v-flex(xs12, sm12)
                    v-text-field(type="password", v-model="passwords.newPassword", counter="18", label="新密码", validate-on-blur,
                      :rules="rules.password", :disabled='!editPassword')
                  v-flex(xs12, sm12)
                    v-text-field(type="password", v-model="passwords.rePassword", counter="18", label="重复密码", validate-on-blur,
                      :rules="rules.union(rules.password,rules.rePassword)", :disabled='!editPassword')
          v-card-actions.justify-end
            v-btn(text, color="error" v-show="editPassword" @click="initModifyPassword") 取消
            v-btn(text, @click="handlePassword" :color="editPassword ? 'orange' : 'primary'",
              :loading='loading.right') {{editPassword?'确认':'修改密码'}}

</template>

<script>
import TableCardSheet from '_c/table-card-sheet'
import * as oauthAPI from '_api/oauth'
import * as restAPI from '_api/rest'
import { emailRules, passwordRules, requiredRules, unionRules, phoneRules, imageRequiredRules, maxLengthRules } from '_u/rule'
import * as utils from '_u/util'
import * as sysUserAPI from '_api/sysUser'
export default {
  name: 'UserSetting',
  components: {
    TableCardSheet
  },
  data () {
    return {
      loading: {
        left: false,
        right: false,
        upload: false
      },
      me: {},
      editPassword: false,
      load: {
        username: false,
        phone: false
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
        rePassword: (val) => {
          if (this.passwords.newPassword !== val) {
            return '两次密码不相同'
          }
          return true
        },
        required: requiredRules,
        union: unionRules,
        phone: phoneRules,
        image: imageRequiredRules,
        maxLength: maxLengthRules
      }
    }
  },
  created () {
    this.me = this._.cloneDeep(this.$store.getters['auth/me'])
  },
  methods: {
    handleExist (action) {
      if (!this.me[action] || !this.edit || this.editUser[action] === this.me[action]) return
      this.load[action] = true
      oauthAPI.authExist({
        username: this.me[action],
        phone: this.me[action],
        action: action
      }).then(res => {
        if (res.data) this.$refs[action].errorBucket = ['账户已存在，请重新输入']
      }).finally(() => { this.load[action] = false })
    },
    handleSubmit () {
      let _this = this
      if (this.edit) {
        if (!this.$refs['user'].validate(true)) {
          return
        }
        _this.loading.left = true
        // 此时是保存，保存数据成功以后，回调
        restAPI.patchOne('sysUser', _this.me.id, {
          username: _this.me.username,
          name: _this.me.name,
          phone: _this.me.phone,
          remark: _this.me.remark
        }).then(res => {
          if (res.data) {
            this.$store.commit('auth/SET_ME', res.data)
            this.$message('个人信息修改成功', 'success')
          }
        }).finally(() => {
          _this.edit = false
          _this.loading.left = false
        })
      } else {
        // 此时是编辑，把原数据保存一下点击取消的时候可以恢复
        this.editUser = this._.cloneDeep(this.me)
        this.edit = true
      }
    },
    handleCancel () {
      this.me = this._.cloneDeep(this.editUser)
      this.edit = false
    },
    async handlePassword () {
      if (this.editPassword) {
        if (!this.$refs['password'].validate(true)) {
          return
        }
        this.loading.right = true
        let err
        [err] = await utils.to(oauthAPI.modifyPassword(this.passwords))
        if (err) {
          this.loading.right = false
          return
        }
        this.$message('密码修改成功', 'success')
        this.loading.right = false
      }
      this.initModifyPassword()
    },
    initModifyPassword () {
      this.editPassword = !this.editPassword
      this.$refs['password'].reset()
    },
    handleUpload () {
      this.$refs.icon.$refs.input.click()
    },
    uploadAvatar (file) {
      this.loading.upload = true
      sysUserAPI.uploadAvatarMe(file).then(res => {
        this.me.icon = res.data.icon
        this.$message('头像更新成功！由于使用免费图床，头像更新具有一定延迟，请稍后查看。')
        this.$store.commit('auth/SET_ME', res.data)
      }).finally(() => { this.loading.upload = false })
    }
  }
}
</script>

<style scoped lang="stylus">
.one-avatar
  top -54px
  position relative
.one-avatar-img
  transition transform 1s ease-in
  &:hover
    -moz-transform rotate(360deg)
    -o-transform rotate(360deg)
    -webkit-transform rotate(360deg)
    transform rotate(360deg)
</style>
