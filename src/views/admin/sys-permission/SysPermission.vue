<template lang="pug">
  v-container#auth-res
    v-alert(type="success", border="left", prominent, elevation="2") 权限管理是系统中极其重要的部分，暂时不提供添加和修改服务！！！
    v-card
      v-card-text
        v-skeleton-loader(:loading="loading", :type="type")
          v-expansion-panels
            v-expansion-panel(v-for="(item,i) in sysPermissions", :key="i")
              v-expansion-panel-header
                v-layout(align-center="true", spacer)
                  v-flex(xs9, sm10, md10)
                    strong {{ item.name }}
                  v-flex(xs3, sm2, md2)
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
    type: 'list-item-avatar, list-item-avatar, list-item-avatar, list-item-avatar, list-item-avatar, list-item-avatar, list-item-avatar, list-item-avatar',
    loading: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'ALL'],
    sysPermissions: []
  }),
  async created () {
    const res = await restAPI.getAll('sysPermission')
    this.sysPermissions = res.data.content
    this.loading = false
  }
}
</script>

<style scoped lang="stylus">

</style>
