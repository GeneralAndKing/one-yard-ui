<template lang="pug">
  v-container#auth-dep
    v-card
      v-card-text
        v-row
          v-col
            v-treeview(:items="items", open-on-click, activatable,
              :load-children="handleLoading", @update:active="handleActive",
              :active.sync="active", transition, return-object)
              template(v-slot:prepend="{ item, active }")
                v-icon(v-if="!item.children") mdi-account
          v-divider(vertical)
          v-col(cols="9", xl="10")
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
                        v-col 采购部门
                        v-col.text-right.mr-4.mb-2(tag="strong", cols="6") 备注
                        v-col {{ selected.remark }}
                v-tab-item(:key="2", :value="'tab-' + 2")
                  v-scroll-y-transition(mode="out-in")
                    .title.grey--text.text--lighten-1.font-weight-light.text-center(v-if="!isSelected")
                      | 请选择一个角色
                    v-card(v-else, :key="selected.id", flat)
                      v-card-text.pa-2.pa-sm-4
                        v-expansion-panels(popout)
                          v-expansion-panel(v-for="(item,i) in permissions", :key="i")
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
                v-tab-item(:key="3", :value="'tab-' + 3")
                  v-scroll-y-transition(mode="out-in")
                    .title.grey--text.text--lighten-1.font-weight-light.text-center(v-if="!isSelected")
                      | 请选择一个角色
                    v-row.pt-6.mx-auto(v-else, :key="selected.id", flat, max-width="400")
                      v-col.mb-2.text-center(cols="4", lg="3", v-for="(user, i) in users", :key="i")
                        v-avatar(size="88", color="indigo")
                          v-img(:src="user.icon")
                        h3.headline.my-2  {{ user.name }}

</template>

<script>
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
  name: 'SysDepartment',
  data: () => ({
    tab: null,
    selected: null,
    active: [],
    open: [],
    items: [],
    users: [],
    permissions: [
      { id: 1,
        name: 'home',
        url: '/home',
        describe: 'api 主界面',
        method: 'GET',
        sort: 1
      }, {
        id: 2,
        name: 'Oauth2',
        url: '/oauth2',
        describe: 'api 主界面',
        method: 'PUT',
        sort: 1
      }
    ]
  }),
  computed: {
    isSelected () {
      if (!this.active.length) return undefined
      return this.active[0] !== null
    }
  },
  created () {
    for (let i = 1; i < 10; i++) {
      this.items.push({
        id: i,
        name: '部门' + i,
        children: []
      })
      this.users.push({
        id: i,
        name: '用户' + i,
        icon: 'https://avatars0.githubusercontent.com/u/9064066?v=4&s=460'
      })
    }
  },
  methods: {
    handleActive (item) {
      this.selected = item[0]
    },
    async handleLoading (item) {
      // 模拟异步等待事件
      await pause(1500)
      for (let i = 1; i < 5; i++) {
        item.children.push({
          id: `${item.id}-${i}`,
          name: `ROLE_角色${item.id}${i}`,
          description: '角色描述',
          icon: 'location_city',
          remark: '备注',
          isEnable: true,
          edit: false
        })
      }
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
