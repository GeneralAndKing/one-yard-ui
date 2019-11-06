<template lang="pug">
  #auth
    v-app-bar#auth-bar(app, clipped-left, :color="color", dense)
      v-app-bar-nav-icon.white--text(@click.stop="drawer = !drawer")
      v-toolbar-title.mr-12.align-center
        span.title.white--text G&K 智能制造管理系统
      v-spacer
      v-btn(icon)
        v-icon.white--text(@click="handleTheme") navigation
      v-menu(left, offset-y)
        template(v-slot:activator="{ on }")
          v-btn(icon, v-on="on")
            v-icon.white--text mdi-dots-vertical
        v-list
          v-list-item(
            v-for="n in 5",
            :key="n",
            @click="() => {}",
          )
            v-list-item-title Option1  {{ n }}
    v-navigation-drawer(v-model="drawer", app, clipped)
      v-list(dense)
        template(v-for="menu in menus")
          v-subheader.grey--text.text--darken-1(v-if="menu.name") {{ menu.name }}
          v-list-item.auth-menu(v-for="item in menu.children",
            :key="item.text", @click="",
            :to="item.to")
            v-list-item-action
              v-icon {{ item.icon }}
            v-list-item-content
              v-list-item-title {{ item.text }}
    v-content
      v-scroll-x-transition(hide-on-leave)
        router-view
</template>

<script>
export default {
  name: 'home',
  data: () => ({
    drawer: true,
    theme: false,
    menus: [{
      children: [
        { icon: 'dashboard', text: '仪表盘', to: { name: 'dashboard' } },
        { icon: 'account_circle', text: '用户管理', to: { name: 'sysUser' } },
        { icon: 'mdi-account-badge-horizontal-outline', text: '角色管理', to: { name: 'sysRole' } },
        { icon: 'mdi-home-account', text: '部门管理', to: { name: 'sysDepartment' } },
        { icon: 'how_to_vote', text: '权限管理', to: { name: 'sysPermission' } }
      ]
    }, {
      name: '物料需求',
      children: [
        { icon: 'location_city', text: '创建计划表', to: { name: 'materialPlanCreate' } },
        { icon: 'av_timer', text: '学期管理', to: { name: 'semester' } },
        { icon: 'school', text: '教师管理', to: { name: 'teacher' } }
      ]
    }, {
      name: '系统管理',
      children: [
        { icon: 'cast_connected', text: '客户端管理', to: { name: 'client' } },
        { icon: 'invert_colors', text: '令牌管理', to: { name: 'token' } },
        { icon: 'trending_up', text: '统计分析', to: { name: 'analytics' } },
        { icon: 'settings', text: '系统设置', to: { name: 'setting' } }
      ]
    }]
  }),
  computed: {
    color: function () {
      return this.theme ? 'red' : 'blue'
    }
  },
  created () {
    this.$vuetify.theme.dark = false
  },
  methods: {
    handleTheme () {
      this.theme = this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    }
  }
}
</script>
