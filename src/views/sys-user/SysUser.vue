<template lang="pug">
  v-container#auth-user.mt-9
    v-card
      v-card-text
        TableCardSheet(title="用户管理", description="你可以自由查看与管理当前系统的用户信息", color="orange")
        v-data-table(:headers="headers", :items="desserts", item-key="name")
          template(v-slot:item.icon="{ item }")
            v-avatar(size="36px")
              v-img(:src="item.icon", :alt="item.name", lazy-src="https://picsum.photos/id/11/10/6")
          template(v-slot:item.roles="{ item }")
            v-chip(v-for="role in item.roles", :key="role.name") {{role.name}}
          template(v-slot:item.status="{ item }")
            v-switch(:loading="item.loading", :disabled="item.disabled" v-model="item.status",
              :true-value="1", :false-value="2", :value="item.status", @click.stop="handleStatus(item)",
              :label="`${item.disabled === true? '等待' : item.status === 1 ? '启用' : '禁用' }`")
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
              v-btn.mb-2.ml-3.mr-3(color="primary") 查询
              v-dialog(v-model="dialog" max-width="800px")
                template(v-slot:activator="{ on }")
                  v-btn.mb-2(color="primary", v-on="on") new
                v-card
                  v-card-title
                    span.headline {{ formTitle }}
                  v-card-text
                    v-container(grid-list-md)
                      v-layout(wrap)
                        v-flex(xs12, sm12)
                          v-img(:src="editedItem.icon", :width="64", :height="64")
                        v-flex(xs12, sm6, md4)
                          v-text-field(v-model="editedItem.name", counter="18", label="用户名")
                        v-flex(xs12, sm6, md4)
                          v-text-field(type="password", v-model="editedItem.password", counter="55", label="密码")
                        v-flex(xs12, sm6, md4)
                          v-file-input(accept="image/*", label="上传头像", small-chips, prepend-icon="")
                        v-flex(xs12, sm6, md4)
                          v-text-field(type="email", v-model="editedItem.email", counter="30", hint="可能用于找回密码", label="电子邮箱")
                        v-flex(xs12, sm6, md4)
                          v-text-field(type="phone", v-model="editedItem.phone", counter="11", hint="长度为11位的手机号", label="手机号")
                        v-flex(xs12, sm6, md4)
                          v-text-field(type="number", v-model="editedItem.sort", label="排序")
                        v-flex(xs12, sm12)
                          v-select(v-model="editedItem.roles", label="角色", :items="roles", item-text="name", chips, multiple)
                        v-flex(xs12, sm12)
                          v-textarea(label="备注", v-model="editedItem.remark", counter="250")
                  v-card-actions
                    v-spacer
                      v-btn.blue.darken-1(text, @click="close") Cancel
                      v-btn.blue.darken-1(text, @click="save") Save
</template>

<script>
import TableCardSheet from '_c/table-card-sheet'
export default {
  name: 'SysUser',
  components: {
    TableCardSheet
  },
  data: () => ({
    isActive: false,
    search: '',
    editedIndex: -1,
    editedItem: {
      icon: '',
      name: '',
      password: '',
      email: '',
      phone: '',
      sort: 1,
      roles: [],
      status: 1,
      createTime: '',
      modifyTime: '',
      remark: '',
      modify: false,
      loading: false,
      disabled: false
    },
    roles: [
      { name: 'admin' },
      { name: 'test1' },
      { name: 'test2' },
      { name: 'test3' },
      { name: 'test4' }
    ],
    defaultItem: {
      icon: '',
      password: '',
      name: '',
      email: '',
      phone: '',
      sort: 1,
      roles: [],
      status: 1,
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
      { text: '用户名', value: 'name', align: 'left' },
      { text: '邮箱', value: 'email' },
      { text: '手机号', value: 'phone' },
      { text: '排序', value: 'sort' },
      { text: '角色', value: 'roles' },
      { text: '状态', value: 'status' },
      { text: '操作', value: 'action', sortable: false }
    ],
    desserts: []
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  created () {
    for (let i = 0; i < 20; i++) {
      this.desserts.push({
        icon: 'https://avatars0.githubusercontent.com/u/9064066?v=4&s=460',
        name: 'admin' + i,
        email: '13712341234@qq.com',
        phone: '13712341234',
        sort: i,
        roles: [{
          name: 'admin'
        }],
        status: 1,
        modify: false,
        loading: false,
        disabled: false
      })
    }
  },
  methods: {
    handleStatus (item) {
      item.status = item.status === 1 ? 2 : 1
      item.loading = 'success'
      item.disabled = true
      setTimeout(() => {
        console.log(item.status)
        item.disabled = false
        // 失败的情况
        // item.status = item.status === 1 ? 2 : 1
        item.loading = false
      }, 1500)
    },
    handleEdit (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
