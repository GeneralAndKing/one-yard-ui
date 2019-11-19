<template lang="pug">
  v-container#auth-user.mt-9
    v-card
      v-card-text
        table-card-sheet(title="用户管理", description="你可以自由查看与管理当前系统的用户信息", color="primary")
        v-data-table(:headers="headers", :items="desserts", item-key="username", :loading="loading",
          loading-text="正在加载数据", :search="search")
          template(v-slot:item.icon="{ item }")
            v-avatar(size="36px")
              v-img(:src="item.icon", :alt="item.name",
                lazy-src="http://q0zlaui5t.bkt.clouddn.com/oneYard/avatar/d244472f-70b7-4a66-9a4e-de39cff10195")
          template(v-slot:item.roles="{ item }")
            v-chip.mr-1(v-for="role in item.roles", :key="role.name") {{role.description}}
          template(v-slot:item.status="{ item }")
            v-switch(:loading="item.loading", :disabled="item.disabled" v-model="item.status",
              true-value="NORMAL", false-value="LOCKED", :value="item.status", @click.stop="handleStatus(item)",
              :label="`${item.disabled === true? '等待' : item.status === 'NORMAL' ? '启用' : '禁用' }`")
          template(v-slot:item.action="{ item }")
            v-btn.ma-2(tile, outlined, color="success", @click="handleEdit(item)")
              v-icon(left) mdi-pencil
              | 编辑
          template(v-slot:top)
            v-toolbar(flat)
              v-text-field(
                v-model="search",
                append-icon="search",
                label="请输入用户名、邮箱或者手机号",
                single-line,
                hide-details
              )
              v-dialog(v-model="dialog", max-width="800px", persistent)
                template(v-slot:activator="{ on }")
                  v-btn.mb-2.ml-3(color="primary", v-on="on") 添加
                v-card(:loading="submitLoading")
                  v-card-title
                    span.headline {{ formTitle }}
                  v-card-text
                    v-form(ref="editedItem")
                      v-container(grid-list-md)
                        v-layout(wrap)
                          v-flex(xs12, sm12)
                            v-hover
                              template( v-slot:default="{ hover }")
                                v-avatar(size="64px")
                                  v-img(:src="editedItem.icon", :width="64", :height="64",
                                    lazy-src="http://q0zlaui5t.bkt.clouddn.com/oneYard/avatar/d244472f-70b7-4a66-9a4e-de39cff10195")
                                  v-fade-transition
                                    v-overlay(v-if="hover", absolute)
                                      v-btn(test, x-small, @click="handleUpload", :loading="load.upload") 上传头像
                            v-file-input.d-none(accept="image/*", label="上传头像", prepend-icon="", ref="icon", @change="uploadAvatar")
                          v-flex(xs12, sm6, md4)
                            v-text-field(v-model="editedItem.username", counter="18", label="用户名", validate-on-blur,
                              :rules="rules.union(rules.required('用户名'),rules.maxLength(18))", ref="username", @blur="handleExist('username')")
                              template(v-slot:append)
                                v-progress-circular(v-if="load.username", size="24", color="info", indeterminate)
                          v-flex(xs12, sm6, md4)
                            v-text-field(v-model="editedItem.name", counter="18", label="姓名", validate-on-blur,
                              :rules="rules.union(rules.required('姓名'),rules.maxLength(18))", ref="name")
                          v-flex(xs12, sm6, md4)
                            v-text-field(type="password", v-model="editedItem.password", counter="18", label="密码", validate-on-blur,
                              :rules="rules.password", ref="password")
                              template(v-slot:append)
                                v-progress-circular(v-if="load.email", size="24", color="info", indeterminate)
                          v-flex(xs12, sm6, md4)
                            v-text-field(type="email", v-model="editedItem.email", counter="30", hint="可能用于找回密码", validate-on-blur,
                              label="电子邮箱" :rules="rules.email", ref="email", @blur="handleExist('email')")
                          v-flex(xs12, sm6, md4)
                            v-text-field(type="phone", v-model="editedItem.phone", counter="11", hint="长度为11位的手机号", validate-on-blur,
                              label="手机号", :rules="rules.phone", @blur="handleExist('phone')", ref="phone")
                              template(v-slot:append)
                                v-progress-circular(v-if="load.phone", size="24", color="info", indeterminate)
                          v-flex(xs12, sm6, md4)
                            v-text-field(type="number", v-model="editedItem.sort", label="排序", :rules="rules.union(rules.required('排序'))")
                          v-flex(xs12, sm12)
                            v-select(v-model="editedItem.roles", label="角色", :items="roles", item-text="description", return-object, chips, multiple,
                              :rules="rules.union(rules.required('角色'))", deletable-chips)
                          v-flex(xs12, sm12)
                            v-textarea(label="备注", v-model="editedItem.remark", counter="250" :rules="rules.union(rules.maxLength(250))")
                  v-card-actions.text-right.justify-end
                    v-btn.darken-1(text, @click="close", dark, color='error') 取消
                    v-btn.darken-1(text, @click="save", dark, color='success') 保存
</template>

<script>
import TableCardSheet from '_c/table-card-sheet'
import { emailRules, passwordRules, requiredRules, unionRules, phoneRules, imageRequiredRules, maxLengthRules } from '_u/rule'
import * as restAPI from '_api/rest'
import * as oauthAPI from '_api/oauth'
import * as sysUserAPI from '_api/sysUser'
import { Role } from '_u/role'
export default {
  name: 'SysUser',
  components: {
    TableCardSheet
  },
  data: () => ({
    loading: false,
    isActive: false,
    submitLoading: false,
    search: '',
    load: {
      username: false,
      phone: false,
      email: false,
      upload: false
    },
    editedIndex: -1,
    editedItem: {
      icon: 'https://picsum.photos/id/11/10/6',
      username: '',
      password: '',
      name: '',
      email: '',
      phone: '',
      sort: 1,
      roles: [],
      status: 'NORMAL',
      createTime: '',
      modifyTime: '',
      remark: '',
      modify: false,
      loading: false,
      disabled: false
    },
    roles: [],
    defaultItem: {
      icon: 'https://picsum.photos/id/11/10/6',
      password: '',
      username: '',
      name: '',
      email: '',
      phone: '',
      sort: 1,
      roles: [],
      status: 'NORMAL',
      createTime: '',
      modifyTime: '',
      remark: '',
      modify: false,
      loading: false,
      disabled: false
    },
    dialog: false,
    headers: [
      { text: '头像', value: 'icon', sortable: false },
      { text: '姓名', value: 'name', align: 'start' },
      { text: '用户名', value: 'username', align: 'start' },
      { text: '邮箱', value: 'email' },
      { text: '手机号', value: 'phone' },
      { text: '排序', value: 'sort' },
      { text: '角色', value: 'roles' },
      { text: '状态', value: 'status' },
      { text: '操作', value: 'action', sortable: false }
    ],
    desserts: [],
    rules: {
      email: emailRules,
      password: passwordRules,
      required: requiredRules,
      union: unionRules,
      phone: phoneRules,
      image: imageRequiredRules,
      maxLength: maxLengthRules
    }
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '添加' : '编辑'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  async created () {
    this.loading = true
    try {
      let role = this.$store.getters['auth/role']
      let resourcesLink
      let roles = await restAPI.getAll('sysRole')
      this.roles = roles.data.content.filter(r => r.name !== 'ROLE_PUBLIC' && r.name !== 'ROLE_LOGIN')
      if (Role.isAdmin(role)) {
        resourcesLink = 'sysUser/all'
      } else if (Role.isSupervisor(role)) {
        resourcesLink = `sysUser/byDepartments/${Role.supervisorList(role)}`
        const selectRoles = await restAPI.getRestLink(`sysRole/search/byDepartments?ids=${Role.supervisorList(role)}`)
        const selectIds = selectRoles.data.content.map(s => s.id)
        this.roles.forEach(r => { if (!selectIds.includes(r.id)) r.disabled = true })
      }
      let users = await restAPI.getLink(resourcesLink)
      users.data.forEach(user => {
        user.model = false
        user.loading = false
        user.disabled = false
        const ids = user.roles.flatMap(r => r.id)
        user.roles = roles.data.content.filter(r => ids.includes(r.id))
        this.desserts.push(user)
      })
    } finally {
      this.loading = false
    }
  },
  methods: {
    handleStatus (item) {
      item.status = item.status === 'NORMAL' ? 'LOCKED' : 'NORMAL'
      item.loading = 'success'
      item.disabled = true
      restAPI.patchOne('sysUser', item.id, { status: item.status })
        .catch(() => { item.status = item.status === 'NORMAL' ? 'LOCKED' : 'NORMAL' })
        .finally(() => {
          item.disabled = false
          item.loading = false
        })
    },
    handleEdit (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    close () {
      this.dialog = false
      this.$refs.editedItem.resetValidation()
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
    },
    save () {
      let _this = this
      if (this.$refs['editedItem'].validate(true)) {
        this.submitLoading = true
        if (this.editedIndex > -1) {
          const data = this.editedItem.password === 'xxxxxxxxxxxxxxxxxx'
            ? this._.omit(this.editedItem, 'password')
            : this.editedItem
          data.roles = []
          this.editedItem.roles.forEach(role => data.roles.push(_this._.find(role.links, { rel: 'self' }).href))
          restAPI.patchOne('sysUser', this.editedItem.id, data)
            .then(() => {
              Object.assign(this.desserts[this.editedIndex], this.editedItem)
              this.close()
              this.$message('修改成功！修改角色需要重新登录哦～！', 'success')
            }).finally(() => { this.submitLoading = false })
        } else {
          const data = this._.cloneDeep(this.editedItem)
          data.roles = []
          this.editedItem.roles.forEach(role => data.roles.push(_this._.find(role.links, { rel: 'self' }).href))
          restAPI.addOne('sysUser', data).then(() => {
            this.desserts.push(this.editedItem)
            this.close()
            this.$message('添加成功！', 'success')
          }).finally(() => { this.submitLoading = false })
        }
      }
    },
    handleExist (action) {
      if ((!this.editedItem[action]) || this.editedIndex === -1) return
      if (this.desserts[this.editedIndex][action] === this.editedItem[action]) return
      this.load[action] = true
      oauthAPI.authExist({
        username: this.editedItem[action],
        email: this.editedItem[action],
        phone: this.editedItem[action],
        action: action
      }).then(res => {
        if (res.data) this.$refs[action].errorBucket = ['账户已存在，请重新输入']
      }).finally(() => { this.load[action] = false })
    },
    handleUpload () {
      this.$refs.icon.$refs.input.click()
    },
    uploadAvatar (file) {
      this.load.upload = true
      sysUserAPI.uploadAvatar(file, this.editedItem.username).then(res => {
        this.load.upload = false
        this.editedItem.icon = res.data.icon
        this.defaultItem.icon = res.data.icon
        let user = this.desserts.find(d => d.id === res.data.id)
        user.icon = res.data.icon
        this.$message('头像更新成功！由于使用免费图床，头像更新具有一定延迟，请稍后查看。')
      })
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
