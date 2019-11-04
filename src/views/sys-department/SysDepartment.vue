<template lang="pug">
  v-container#auth-dep
    v-card
      v-layout(wrap)
        v-flex
          v-card-text
            v-treeview(
              :items="items",
              open-on-click,
              activatable,
              @update:active="handleActive",
              open-all,
              transition,
              return-object
            )
        v-divider(vertical)
        v-flex(xs12, md8)
          v-tabs(v-model="tab")
            v-tabs-slider
            v-tab(href="#tab-1") 所有用户
            v-tab(href="#tab-2") 所有权限

</template>

<script>

export default {
  name: 'SysDepartment',
  data: () => ({
    description: '',
    tab: null,
    items: [{
      id: 1,
      name: '部门1',
      description: '介绍',
      children: [
        {
          id: 1,
          name: '角色11',
          description: '介绍'
        }, {
          id: 2,
          name: '角色12',
          description: '介绍'
        }, {
          id: 3,
          name: '角色13',
          description: '介绍'
        }, {
          id: 4,
          name: '角色14',
          description: '介绍'
        }
      ]
    }, {
      id: 2,
      name: '部门2',
      description: '介绍',
      children: [
        {
          id: 1,
          name: '角色21',
          description: '介绍'
        }, {
          id: 2,
          name: '角色22',
          description: '介绍'
        }, {
          id: 3,
          name: '角色23',
          description: '介绍'
        }, {
          id: 4,
          name: '角色24',
          description: '介绍'
        }
      ]
    }]
  }),
  methods: {
    handleActive (item) {
      if (item.length > 0) this.description = item[0].description
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
