<template lang="pug">
  v-container#auth-role
    v-btn(fixed, fab, bottom, right, color="pink", @click="handleAdd")
      v-icon mdi-plus
    v-snackbar(v-model="tip", :timeout="3000") {{tipText}}
      v-btn(color="red", text, @click="tip = false") Close
    v-layout(wrap)
      v-flex.pa-4(xs12, sm6, md6, lg6, xl4, v-for="role in sysRoles", :key="role.id")
        v-card
          v-card-title
            v-avatar(color="indigo", size="36")
              v-icon.white--text {{ role.icon }}
            span.pl-3 {{ role.name }}
            v-spacer
            v-switch(v-model="role.isEnable")
          v-card-text
            v-list(three-line)
              v-list-item(:ripple="!role.edit")
                v-list-item-content.pa-0
                  v-text-field(v-model="role.name", label="角色名", :readonly="!role.edit" :rules="rules.union(rules.required('角色名'))" ref="name")
              v-list-item(:ripple="!role.edit")
                v-list-item-content.pa-0
                  v-text-field(v-model="role.des", label="描述", :readonly="!role.edit" :rules="rules.union(rules.required('描述'))" ref="des")
              v-list-item(:ripple="!role.edit")
                v-list-item-content.pa-0
                  v-select(v-model="role.department", :items="departments", item-text="name", label="所属部门", :readonly="!role.edit" :rules="rules.union(rules.required('所属部门'))" ref="department")
              v-list-item(:ripple="!role.edit")
                v-list-item-content.pa-0
                    v-select(v-model="role.permissions", label="权限", :items="permissions", item-text="name", chips, multiple, :readonly="!role.edit" :rules="rules.union(rules.required('权限'))" ref="permissions")
              v-list-item(:ripple="!role.edit")
                v-list-item-content.pa-0
                  v-text-field(v-model="role.icon", label="图标", :readonly="!role.edit" :rules="rules.union(rules.required('图标'))" ref="icon")
              v-list-item(:ripple="!role.edit")
                v-list-item-content.pa-0
                  v-textarea(v-model="role.remark", label="备注", counter="255", :readonly="!role.edit" ref="remark")
            v-flex(md-12, text-right)
              v-btn.text-right(v-if="role.edit", @click="handleCancel(role)") 取消
              v-btn.text-right(@click="handleSubmit(role)") {{ role.edit ? '保存' : '编辑' }}
</template>

<script>
import TableCardSheet from '_c/table-card-sheet'
import { requiredRules, unionRules } from '_u/rule'

export default {
  name: 'SysRole',
  components: {
    TableCardSheet
  },
  data: () => ({
    tip: false,
    tipText: '',
    permissions: [
      { id: 1, name: 'asd' },
      { id: 2, name: 'aaa' },
      { id: 3, name: 'bbb' }
    ],
    add: false,
    sysRoles: [
      {
        id: 1,
        name: 'ROLE_PUBLIC',
        des: 'aaaa',
        icon: 'location_city',
        remark: '备注',
        isEnable: true,
        department: {
          id: 1,
          name: '采购部门1'
        },
        permissions: [ { id: 1, name: 'asd' } ],
        edit: false
      }, {
        id: 2,
        name: 'ROLE_ADMIN',
        des: '123123',
        icon: 'location_city',
        remark: '备注',
        department: {
          id: 1,
          name: '采购部门1'
        },
        permissions: [ { id: 1, name: 'asd' } ],
        isEnable: true,
        edit: false
      }
    ],
    departments: [
      { id: 1, name: '采购部门1' },
      { id: 2, name: '采购部门2' },
      { id: 3, name: '采购部门3' }
    ],
    rules: {
      required: requiredRules,
      union: unionRules
    },
    editItem: {}
  }),
  methods: {
    handleSubmit (role) {
      role.edit = !role.edit
      if (!role.edit) {
        // 保存的时候
        this.showTip('保存成功～！')
      } else {
        // 编辑的时候
        this.editItem = this._.cloneDeep(role)
      }
      this.add = false
    },
    handleCancel (role) {
      if (this.add) {
        this.sysRoles.shift()
        this.add = false
        return
      }
      this._.forOwn(this.editItem, (value, key) => {
        role[key] = value
      })
      role.edit = false
    },
    save () {
      if (this.$refs['editedItem'].validate(true)) {
        // TODO: 数据保存
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem)
        }
        this.close()
      }
    },
    handleAdd () {
      if (this.add) {
        this.showTip('不要重复添加哦～先完成当前的添加把！')
      } else {
        this.sysRoles.unshift({
          isEnable: true,
          edit: true
        })
        this.add = true
      }
    },
    showTip (tipText) {
      this.tip = true
      this.tipText = tipText
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
