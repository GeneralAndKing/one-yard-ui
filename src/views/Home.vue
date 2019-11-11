<template lang="pug">
  #auth
    v-app-bar#auth-bar(app, clipped-left, :color="color", dense)
      v-app-bar-nav-icon.white--text(@click.stop="drawer = !drawer")
      v-toolbar-title.mr-12.align-center
        span.title.white--text G&K 智能制造管理系统
      v-spacer
      v-btn(icon, @click="handleTheme")
        v-icon.white--text navigation
      v-badge.one-badge(color="error", overlap, bottom)
        template(v-slot:badge)
          span !
        v-btn(icon)
          v-icon.white--text mdi-bell
      v-menu(left, offset-y)
        template(v-slot:activator="{ on }")
          v-btn(icon, v-on="on", large)
            v-icon.white--text mdi-dots-vertical
        v-list(two-line, subheader, tile)
          v-list-item(@click="() => {}", link)
            v-list-item-avatar
              v-img(src="https://randomuser.me/api/portraits/men/28.jpg", alt="avatar")
            v-list-item-content
              v-list-item-title 用户昵称
              v-list-item-subtitle 574196898(用户名或邮箱)
          v-list-item-group
            v-list-item(@click="() => {}", link)
              v-list-item-avatar
                v-icon mdi-clock
              v-list-item-content 个人设置
            v-list-item(@click="() => {}", link)
              v-list-item-avatar
                v-icon mdi-flag
              v-list-item-content 退出
    v-navigation-drawer(v-model="drawer", app, clipped)
      treeMenu(:router="menus[0].children")
    v-content
      v-scroll-y-transition(hide-on-leave, mode="out-in")
        router-view
</template>

<script>
import { genMenu } from '_u/util'
import treeMenu from '_c/tree-menu'
import * as restAPI from '_api/rest'
export default {
  name: 'home',
  components: { treeMenu },
  data: () => ({
    drawer: true,
    theme: false,
    menus: []
  }),
  computed: {
    color: function () {
      return this.theme ? 'red' : 'blue'
    }
  },
  created () {
    this.$vuetify.theme.dark = false
    let router = this.$store.getters['auth/router']
    console.log('asd')
    this.menus = genMenu(router)
    this.connection()
  },
  beforeDestroy () {
    if (this.socket !== null) this.socket.close()
  },
  methods: {
    handleTheme () {
      this.theme = this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
    connection () {
      // 建立连接对象
      this.socket = new WebSocket('ws://localhost:8080/api/notify/1')
      restAPI.getLink('notification/test/1')
      this.socket.onerror = err => {
        console.log(err)
      }
      this.socket.onopen = event => {
        console.log(event)
      }
      this.socket.onmessage = mess => {
        console.log(mess)
        console.log(JSON.parse(mess.data))
      }
      this.socket.onclose = () => {
        console.log('连接关闭')
      }
    }
  }
}
</script>
