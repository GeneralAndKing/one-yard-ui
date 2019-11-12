<template lang="pug">
  #auth
    v-app-bar#auth-bar(app, clipped-left, :color="color")
      v-app-bar-nav-icon.white--text(@click.stop="drawer = !drawer")
      v-toolbar-title.mr-12.align-center
        span.title.white--text G&K 智能制造管理系统
      v-spacer
      v-btn(icon, @click="handleTheme")
        v-icon.white--text navigation
      v-badge.one-badge(:color="theme ? 'blue' : 'error'", overlap, bottom)
        template(v-slot:badge)
          span !
        v-btn(icon, @click="notice = true")
          v-icon.white--text mdi-bell
      v-menu(left, offset-y)
        template(v-slot:activator="{ on }")
          v-btn(icon, v-on="on", large)
            v-icon.white--text mdi-dots-vertical
        v-list(two-line, subheader, dense)
          v-list-item(@click="() => {}", link)
            v-list-item-avatar
              v-img(src="https://randomuser.me/api/portraits/men/28.jpg", alt="avatar")
            v-list-item-content
              v-list-item-title 用户昵称
              v-list-item-subtitle 574196898(用户名或邮箱)
          v-divider
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
      treeMenu(:router="menus")
    v-navigation-drawer(v-model="notice", fixed, right, temporary)
      v-tabs(v-model="currentItem", show-arrows)
        v-tab(v-for="(item) in messages", :href="`#tab-${item.type}`") {{item.type}}
        v-tabs-items(v-model="currentItem")
          v-tab-item(v-for="item in messages", :key="item.type", :value="`tab-${item.type}`")
            v-list(three-line)
              v-list-item.mb-1(v-for="message in item.items",
                :class="message.status === 'READ'? 'one-read' : 'one-un-read'")
                v-list-item-content
                  v-list-item-title {{message.name}}
                  v-list-item-subtitle {{message.content}}
                  v-list-item-icon.ma-0.justify-end
                    v-btn(text, small, color="primary", @click="handleInfo(message)") 详情
                    v-btn(text, small, :color="message.status === 'READ'? 'error' : 'success'") {{message.status === 'READ' ? '标为未读' : '标为已读'}}
    v-dialog(v-model="noticeDialog", max-width="350")
      v-card
        v-card-title.headline {{showMessage.name}}
        v-card-text
          p {{showMessage.content}}
        v-card-actions
          v-spacer
          v-btn(text, color="primary", @click="handleRead") 已读
    v-content
      v-scroll-y-transition(hide-on-leave, mode="out-in")
        router-view
</template>

<script>
import { genMenu } from '_u/menu'
import treeMenu from '_c/tree-menu'
import * as restAPI from '_api/rest'
export default {
  name: 'home',
  components: { treeMenu },
  data: () => ({
    currentItem: null,
    showMessage: null,
    drawer: true,
    theme: false,
    noticeDialog: false,
    menus: [],
    notice: false,
    messages: [ {
      type: '未读',
      items: [
        { name: '通知', content: '通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息' }
      ]
    }, {
      type: '已读',
      items: [
        { name: '通知', content: '通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息', status: 'READ' }
      ]
    }, {
      type: '全部',
      items: [
        { name: '通知', content: '通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息' }
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
    this.menus = genMenu()
    this.connection()
    this.initShowMessage()
  },
  beforeDestroy () {
    if (this.socket !== null) this.socket.close()
  },
  methods: {
    initShowMessage () {
      this.showMessage = {
        name: '',
        content: ''
      }
    },
    handleTheme () {
      this.theme = this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
    connection () {
      // 建立连接对象
      this.socket = new WebSocket('ws://localhost:8080/api/notify/1')
      restAPI.getLink('notification/test/1')
      this.socket.onerror = () => {
        console.log('链接失败')
      }
      this.socket.onopen = () => {
        console.log('成功建立链接')
      }
      this.socket.onmessage = mess => {
        console.log(JSON.parse(mess.data))
      }
      this.socket.onclose = () => {
        console.log('连接关闭')
      }
    },
    handleRead () {
      this.noticeDialog = false
      this.initShowMessage()
    },
    handleInfo (message) {
      this.noticeDialog = true
      this.showMessage = message
    }
  }
}
</script>

<style scoped lang="stylus">
.one-un-read
  border-left 4px solid #EF5350
  background rgba(255,235,238,0.2)
.one-read
  border-left 4px solid #00C853
  background rgba(241,248,233,0.2)
</style>
