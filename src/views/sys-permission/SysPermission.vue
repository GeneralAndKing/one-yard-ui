<template lang="pug">
  v-container#auth-res
    v-btn(fixed, fab, bottom, right, color="pink", @click="handleAdd")
      v-icon mdi-plus
    v-snackbar(v-model="tip", :timeout="3000") {{tipText}}
      v-btn(color="red", text, @click="tip = false") Close
    v-alert(type="warning", border="left", prominent, elevation="2", outlined) 权限管理是系统中极其重要的部分，非专业人士请勿擅自修改！！！
    v-card
      v-card-text.pa-2.pa-sm-4
        v-expansion-panels(popout)
          v-expansion-panel(v-for="(item,i) in sysPermissons", :key="i")
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
              code {{ item.url }}
              p {{ item.describe }}
              v-chip-group(column)
                v-chip(v-for="role in item.roles", :key="role.name")  {{ role.name }}
              v-bottom-sheet(v-model="modifyForm", inset)
                template(v-slot:activator="{ on }")
                  v-btn.float-right(v-on="on", @click="handleEdit(item)") {{action}}
                v-sheet.pa-3
                  v-btn.float-right(text, color="error", @click="modifyForm = !modifyForm") close
                  h4 编辑
                  v-container(grid-list-md)
                    v-form
                      v-layout(wrap, style="width:100%")
                        v-flex(xs12, sm6)
                          v-text-field(v-model="editItem.name", counter="18", label="权限名称")
                        v-flex(xs12, sm6)
                          v-text-field(v-model="editItem.describe", counter="55", label="描述")
                        v-flex(xs12, sm6)
                          v-text-field(v-model="editItem.describe", counter="55", label="URL 匹配")
                        v-flex(xs12, sm6)
                          v-select(v-model="editItem.method", label="请求方法", :items="methods")
                        v-flex(xs12, sm6)
                          v-select(v-model="editItem.departments", label="赋予部门", :items="departments", item-text="name", chips, multiple)
                        v-flex(xs12, sm6)
                          v-select(v-model="editItem.roles", label="赋予角色", :items="roles", item-text="name", chips, multiple)
                        v-flex.pt-6(xs12, sm6)
                          v-btn(@click="handleSave") SAVE
</template>

<script>

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
    sysPermissons: [
      { id: 1,
        name: 'home',
        url: '/home',
        describe: 'api 主界面',
        method: 'GET',
        sort: 1,
        roles: [ { name: 'ROLE_ADMIN' }, { name: 'ROLE_TEACHER' } ],
        departments: [ { id: 1, name: '采购部门1' } ]
      },
      { id: 2,
        name: 'Oauth2',
        url: '/oauth2',
        describe: 'api 主界面',
        method: 'PUT',
        sort: 1,
        roles: [ { name: 'ROLE_TEACHER' } ],
        departments: [ { id: 1, name: '采购部门1' } ] },
      { id: 3,
        name: 'Oauth2-提交',
        url: '/oauth2',
        describe: 'api 主界面',
        method: 'POST',
        sort: 1,
        roles: [ { name: 'ROLE_STUDENT' } ],
        departments: [ { id: 1, name: '采购部门1' } ] },
      { id: 4,
        name: '学生管理',
        url: '/oauth2',
        describe: '获取自己的教师信息',
        method: 'POST',
        sort: 1,
        roles: [ { name: 'ROLE_TEACHER' } ],
        departments: [ { id: 1, name: '采购部门1' } ] },
      { id: 5,
        name: '教师管理',
        url: '/oauth2',
        describe: '获取自己的教师信息',
        method: 'ALL',
        sort: 1,
        roles: [ { name: 'ROLE_STUDENT' } ],
        departments: [ { id: 1, name: '采购部门1' } ] },
      { id: 6,
        name: '学生管理',
        url: '/oauth2',
        describe: '获取自己的教师信息',
        method: 'DELETE',
        sort: 1,
        roles: [ { name: 'ROLE_TEACHER' } ],
        departments: [ { id: 1, name: '采购部门1' } ] },
      { id: 7,
        name: '数据管理',
        url: '/oauth2',
        describe: '获取自己的教师信息',
        method: 'ALL',
        sort: 1,
        roles: [ { name: 'ROLE_STUDENT' } ],
        departments: [ { id: 1, name: '采购部门1' } ] },
      { id: 8,
        name: '教师管理',
        url: '/oauth2',
        describe: '获取指定多个id数据信息',
        method: 'PATCH',
        sort: 1,
        roles: [ { name: 'ROLE_TEACHER' } ],
        departments: [ { id: 1, name: '采购部门1' } ] },
      { id: 9,
        name: '学期管理',
        url: '/oauth2',
        describe: '获取指定多个id数据信息',
        method: 'POST',
        sort: 1,
        roles: [ { name: 'ROLE_STUDENT' } ],
        departments: [ { id: 1, name: '采购部门1' } ] },
      { id: 10,
        name: '学生管理',
        url: '/oauth2',
        describe: '获取指定多个id数据信息',
        method: 'PUT',
        sort: 1,
        roles: [ { name: 'ROLE_STUDENT' } ],
        departments: [ { id: 1, name: '采购部门1' } ] },
      { id: 11,
        name: '教师管理',
        url: '/oauth2',
        describe: '获取指定多个id数据信息',
        method: 'PATCH',
        sort: 1,
        roles: [ { name: 'ROLE_TEACHER' } ],
        departments: [ { id: 1, name: '采购部门1' } ] },
      { id: 12,
        name: '学期管理',
        url: '/oauth2',
        describe: '获取指定多个id数据信息',
        method: 'ALL',
        sort: 1,
        roles: [ { name: 'ROLE_TEACHER' } ],
        departments: [ { id: 1, name: '采购部门1' } ] },
      { id: 13,
        name: '数据管理',
        url: '/oauth2',
        describe: '获取指定多个id数据信息',
        method: 'PUT',
        sort: 1,
        roles: [ { name: 'ROLE_STUDENT' } ],
        departments: [ { id: 1, name: '采购部门1' } ] }
    ],
    editItem: {}
  }),
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
        this.sysPermissons.unshift(this.editItem)
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
