<template lang="pug">
  v-container#auth-role
    v-layout(wrap)
      v-flex.pa-4(xs12, sm6, md4, v-for="role in sysRoles", :key="role.id")
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
                  v-text-field(v-model="role.name", label="角色名", :readonly="!role.edit")
              v-list-item(:ripple="!role.edit")
                v-list-item-content.pa-0
                  v-text-field(v-model="role.des", label="描述", :readonly="!role.edit")
              v-list-item(:ripple="!role.edit")
                v-list-item-content.pa-0
                  v-select(v-model="role.department", :items="departments", item-text="name", label="所属部门", :readonly="!role.edit")
              v-list-item(:ripple="!role.edit")
                v-list-item-content.pa-0
                  v-text-field(v-model="role.icon", label="图标", :readonly="!role.edit")
              v-list-item(:ripple="!role.edit")
                v-list-item-content.pa-0
                  v-textarea(v-model="role.remark", label="备注", counter="255", :readonly="!role.edit")
            v-flex(md-12, text-right)
              v-btn.text-right(v-if="role.edit", @click="handleCancel(role)") 取消
              v-btn.text-right(@click="handleSubmit(role)") {{ role.edit ? '保存' : '编辑' }}
</template>

<script>
import TableCardSheet from '_c/table-card-sheet'

export default {
  name: 'SysRole',
  components: {
    TableCardSheet
  },
  data: () => ({
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
        isEnable: true,
        edit: false
      }
    ],
    departments: [
      {
        id: 1,
        name: '采购部门1'
      }, {
        id: 2,
        name: '采购部门2'
      }, {
        id: 3,
        name: '采购部门3'
      }
    ],
    editItem: {}
  }),
  methods: {
    handleSubmit (role) {
      role.edit = !role.edit
      if (!role.edit) {
        // 保存的时候
        console.log('保存')
      } else {
        // 编辑的时候
        this.editItem = this._.cloneDeep(role)
        console.log('编辑')
      }
    },
    handleCancel (role) {
      this._.forOwn(this.editItem, (value, key) => {
        role[key] = value
      })
      role.edit = false
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
