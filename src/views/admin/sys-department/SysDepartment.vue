<template lang="pug">
  v-container#auth-dep
    v-card
      v-card-text
        v-row
          v-col(sm="12", md="4", xl="3")
            v-skeleton-loader.mt-6(:loading="loading", type="card-heading, card-heading, card-heading, card-heading, card-heading, card-heading")
              v-treeview(:items="items", open-on-click, activatable, :open.sync="open",
                :load-children="handleLoading", @update:active="handleActive", item-key="name",
                :active.sync="active", transition, return-object)
                template(v-slot:prepend="{ item, active }")
                  v-icon(v-if="!item.children") mdi-account
                template(v-slot:label="{ item, leaf }")
                  span(v-if="leaf") {{item.description}}
                  span(v-else) {{item.name}}
          v-divider(vertical)
          v-col(sm="12", md="7", xl="8")
            v-tabs(v-model="tab")
              v-tabs-slider
              v-tab(href="#tab-1") 角色信息
              v-tab(href="#tab-2") 所有权限
              v-tab(href="#tab-3") 所有用户
              v-tabs-items(v-model="tab")
                v-tab-item(:key="1", :value="'tab-' + 1")
                  v-scroll-y-transition(mode="out-in")
                    .title.grey--text.text--lighten-1.font-weight-light.text-center(v-if="!isSelected")
                      | 请选择一个角色
                    v-card.pt-6.mx-auto(v-else, :key="selected.id", flat, max-width="400")
                      v-card-text.text-center
                        v-avatar(v-if="selected.icon", size="88", color="indigo")
                          v-icon(dark, large) {{selected.icon}}
                        h3.headline.my-2  {{ selected.name }}
                      v-divider
                      v-row.text-left(tag="v-card-text")
                        v-col.text-right.mr-4.mb-2(tag="strong", cols="6") 描述
                        v-col {{ selected.description }}
                        v-col.text-right.mr-4.mb-2(tag="strong", cols="6") 所属部门
                        v-col {{ selected.department.name }}
                        v-col.text-right.mr-4.mb-2(tag="strong", cols="6") 备注
                        v-col {{ selected.remark === null ? '无' : selected.remark }}
                v-tab-item(:key="2", :value="'tab-' + 2")
                  v-scroll-y-transition(mode="out-in")
                    .title.grey--text.text--lighten-1.font-weight-light.text-center(v-if="!isSelected")
                      | 请选择一个角色
                    v-card(v-else, :key="selected.id", flat)
                      v-card-text.pa-2.pa-sm-4
                        v-expansion-panels
                          v-expansion-panel(v-for="(item,i) in permissions", :key="i")
                            v-expansion-panel-header.pa-sm-5.pa-1
                              v-layout(align-center="true", spacer)
                                v-flex(xs10, sm10, md10)
                                  strong {{ item.name }}
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
                v-tab-item(:key="3", :value="'tab-' + 3")
                  v-scroll-y-transition(mode="out-in")
                    .title.grey--text.text--lighten-1.font-weight-light.text-center(v-if="!isSelected")
                      | 请选择一个角色
                    v-row.pt-6.mx-auto(v-else, :key="selected.id", flat, max-width="400")
                      v-col.mb-2.text-center(cols="4", lg="3", v-for="(user, i) in users", :key="i")
                        v-avatar(size="88", color="indigo")
                          v-img(:src="user.icon", lazy-src="http://image.japoul.cn/oneYard/avatar/d244472f-70b7-4a66-9a4e-de39cff10195")
                        h3.headline.my-2  {{ user.name }}

</template>

<script>
import * as restAPI from '_api/rest'
import * as departmentAPI from '_api/department'
export default {
  name: 'SysDepartment',
  data: () => ({
    loading: true,
    tab: null,
    selected: {},
    active: [],
    open: [],
    items: [],
    users: [],
    permissions: []
  }),
  computed: {
    isSelected () {
      if (!this.active.length) return undefined
      return this.active[0] !== null
    }
  },
  async created () {
    let res = await restAPI.getAll('sysDepartment')
    let _this = this
    res.data.content.forEach(d => {
      d.children = []
      _this.items.push(d)
    })
    this.loading = false
  },
  methods: {
    handleActive (item) {
      if (!item.length) return
      this.selected = item[0]
      this.selected.department = this._.find(this.items, { id: this.selected.departmentId })
      departmentAPI.getPermissionByRole(this.selected.id)
        .then(res => { this.permissions = res.data.content })
      departmentAPI.getUserByRole(this.selected.id)
        .then(res => { this.users = res.data.content })
    },
    async handleLoading (item) {
      const res = await departmentAPI.getRoleByDepartment(item.id)
      item.children = res.data.content
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
