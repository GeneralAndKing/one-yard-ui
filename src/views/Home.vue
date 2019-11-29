<template lang="pug">
  #auth
    v-app-bar#auth-bar(app, clipped-left, color="primary")
      v-app-bar-nav-icon.white--text(@click.stop="drawer = !drawer")
      v-toolbar-title.mr-12.align-center
        span.title.white--text G&K 智能制造管理系统
      v-spacer
      v-btn(icon, @click="handleTheme")
        v-icon.white--text navigation
      v-badge.one-badge(color="accent", overlap, top)
        template(v-slot:badge, v-if="messages[0].items.length > 0")
          p.font-weight-medium {{messages[0].items.length}}
        v-btn(icon, @click="notice = true")
          v-icon.white--text mdi-bell
      v-menu(left, offset-y)
        template(v-slot:activator="{ on }")
          v-btn(icon, v-on="on", large)
            v-icon.white--text mdi-dots-vertical
        v-list(two-line, subheader, dense, flat)
          v-list-item(link)
            v-list-item-avatar
              v-img(:src="me.icon", alt="avatar",
                lazy-src="http://q0zlaui5t.bkt.clouddn.com/oneYard/avatar/d244472f-70b7-4a66-9a4e-de39cff10195")
            v-list-item-content
              v-list-item-title {{me.name}}
              v-list-item-subtitle {{me.email}}
          v-divider
          v-list-item-group
            v-list-item(:to="{ name: 'userSetting' }")
              v-list-item-avatar
                v-icon mdi-settings mdi-spin
              v-list-item-content 个人设置
            v-list-item(href="https://generalandking.github.io/one-yard-ui/", target="_blank")
              v-list-item-avatar
                v-icon mdi-help-circle
              v-list-item-content 帮助
            v-list-item(@click="() => {$store.dispatch('auth/logout')}")
              v-list-item-avatar
                v-icon mdi-flag
              v-list-item-content 退出
    v-navigation-drawer(v-model="drawer", app, clipped)
      treeMenu(:router="menus")
    v-navigation-drawer(v-model="notice", fixed, right, temporary, app)
      v-tabs(v-model="currentItem",  fixed-tabs)
        v-tab(v-for="(item) in messages", :key="`tab-${item.type}`", :href="`#tab-${item.type}`") {{item.type}}
        v-tabs-items(v-model="currentItem")
          v-tab-item(v-for="item in messages", :key="item.type", :value="`tab-${item.type}`")
            v-list(three-line, :dark="theme")
              v-list-item.mb-1(v-if="item.items.length > 0", v-for="message in item.items", :key="message.type",
                :class="message.status === 'READ'? 'one-read' : 'one-un-read'")
                v-list-item-content
                  v-list-item-title {{message.name}}
                  v-list-item-subtitle(v-html="message.message")
                  v-list-item-icon.ma-0.justify-end
                    v-btn(text, small, color="info", @click="handleInfo(message)") 详情
                    v-btn(text, small, :color="message.status === 'READ'? 'error' : 'success'", @click="handleChange(message)") {{message.status === 'READ' ? '标为未读' : '标为已读'}}
                  span.overline.font-weight-thin.text-right {{message.createTime.replace('T', ' ')}}
              v-list-item(v-if="item.items.length === 0")
                v-list-item-subtitle.text-center.body-1.font-weight-light 暂无通知信息
    v-dialog(v-model="noticeDialog", max-width="350")
      v-card
        v-card-title.headline {{showMessage.name}}
        v-card-text
          p(v-html="showMessage.message")
        v-card-actions
          v-spacer
          v-btn(outlined, color="info", @click="handleRead") 已读
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
  data () {
    return {
      currentItem: null,
      showMessage: null,
      drawer: true,
      theme: false,
      noticeDialog: false,
      menus: genMenu(),
      notice: false,
      messages: [{
        type: '未读',
        items: []
      }, {
        type: '已读',
        items: []
      }]
    }
  },
  computed: {
    me: function () {
      return this.$store.getters['auth/me']
    }
  },
  created () {
    this.$store.dispatch('auth/getMe')
    this.changeTheme()
    this.initNotice()
    this.initShowMessage()
  },
  beforeDestroy () {
    if (this.socket !== null) this.socket.close()
  },
  methods: {
    initShowMessage () {
      this.showMessage = {
        name: '',
        message: '',
        createTIme: ''
      }
    },
    handleTheme () {
      this.$store.dispatch('sundry/changeTheme')
      this.changeTheme()
    },
    changeTheme () {
      this.$vuetify.theme.dark = this.$store.getters['sundry/theme']
      this.theme = this.$store.getters['sundry/theme']
    },
    initNotice () {
      this.socket = new WebSocket(`ws://127.0.0.1:8080/api/notify/${this.me.id}`)
      restAPI.getRestLink(`notification/search/byReceiverId?receiverId=${this.me.id}`).then((res) => {
        this.messages[1].items = res.data.content.filter(n => n.status === 'READ')
        this.messages[0].items = res.data.content.filter(n => n.status === 'UNREAD')
      })
      this.socket.onerror = () => {
        console.error('建立链接失败')
      }
      this.socket.onopen = () => {
        console.log('成功建立链接')
      }
      this.socket.onmessage = mess => {
        this.messages[0].items.unshift(JSON.parse(mess.data))
        console.log(JSON.parse(mess.data))
      }
      this.socket.onclose = () => {
        console.log('连接关闭')
      }
    },
    handleRead () {
      this.noticeDialog = false
      if (this.showMessage.status === 'UNREAD') this.handleChange(this.showMessage)
      this.initShowMessage()
    },
    handleInfo (message) {
      this.noticeDialog = true
      this.showMessage = message
    },
    handleChange (message) {
      const status = message.status === 'UNREAD' ? 'READ' : 'UNREAD'
      restAPI.patchOne('notification', message.id, {
        status: status
      }).then(() => {
        message.status = status
        if (status === 'READ') {
          this.messages[0].items.splice(this.messages[0].items.indexOf(message), 1)
          this.messages[1].items.unshift(message)
        } else {
          this.messages[1].items.splice(this.messages[1].items.indexOf(message), 1)
          this.messages[0].items.unshift(message)
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
.one-un-read
  border-left 4px solid #EF5350
.one-read
  border-left 4px solid #00C853
</style>
