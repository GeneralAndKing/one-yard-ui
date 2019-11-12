<template lang="pug">
  v-container#auth-res
    v-snackbar(v-model="tip", :timeout="3000") {{tipText}}
      v-btn(color="red", text, @click="tip = false") Close
    v-alert(type="warning", border="left", prominent, elevation="2", outlined) 权限管理是系统中极其重要的部分，暂时不提供添加和修改服务！！！
    v-card
      v-card-text.pa-2.pa-sm-4
        v-expansion-panels(popout)
          v-expansion-panel(v-for="(item,i) in sysPermissions", :key="i")
            v-expansion-panel-header.pa-sm-5.pa-1
              v-layout(align-center="true", spacer)
                v-flex(xs4, sm4, md4)
                  strong {{ item.name }}
                v-flex(xs6, sm6, md6)
                  span {{ item.describe }}
                v-flex(xs2, sm2, md2)
                  v-chip.white--text(v-if="item.method === 'GET'", color="green") {{ item.method }}
                  v-chip.white--text(v-if="item.method === 'POST'", color="blue") {{ item.method }}
                  v-chip.white--text(v-if="item.method === 'PUT'", color="purple ") {{ item.method }}
                  v-chip.white--text(v-if="item.method === 'DELETE'", color="red") {{ item.method }}
                  v-chip.white--text(v-if="item.method === 'ALL'", color="orange") {{ item.method }}
                  v-chip.white--text(v-if="item.method === 'PATCH'", color="cyan") {{ item.method }}
            v-expansion-panel-content
              code {{ item.matchUrl }}
              p {{ item.description }}

</template>

<script>
import * as restAPI from '_api/rest'
export default {
  name: 'SysPermission',
  data: () => ({
    modifyForm: false,
    tip: false,
    tipText: '',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'ALL'],
    action: '',
    roles: [
      { id: 1, name: 'ROLE_ADMIN' },
      { id: 2, name: 'ROLE_TEACHER' },
      { id: 3, name: 'ROLE_STUDENT' }
    ],
    departments: [
      { id: 1, name: '采购部门1' },
      { id: 2, name: '采购部门2' },
      { id: 3, name: '采购部门3' }
    ],
    sysPermissions: [],
    editItem: {}
  }),
  created () {
    restAPI.getAll('sysPermission').then(res => { this.sysPermissions = res.data.content })
  },
  methods: {
    handleEdit (permission) {
      this.editItem = this._.cloneDeep(permission)
      this.action = '编辑'
    },
    handleAdd () {
      this.action = '添加'
      this.modifyForm = true
      this.editItem = {}
    },
    handleSave () {
      if (this.action === '添加') {
        this.sysPermissions.unshift(this.editItem)
      }
      this.modifyForm = false
      this.showTip('保存成功')
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
