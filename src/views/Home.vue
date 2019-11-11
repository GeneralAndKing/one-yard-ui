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
    this.disconnect()
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
    },
    // 断开连接
    disconnect () {
      if (this.stompClient != null) {
        this.stompClient.disconnect()
        console.log('Disconnected')
      }
    }
  }
}
</script>
