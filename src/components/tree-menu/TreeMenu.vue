<template lang="pug">
  div
    div(v-for="(menu,index) in router" :key="index")
      v-list-item-group.py-1(v-if="!menu.children", color="primary")
        v-list-item(:to="menu.to", :key="index", link)
          v-list-item-action
            v-icon {{ menu.icon }}
          v-list-item-content
            v-list-item-title {{menu.text}}
      v-subheader.mt-4.grey--text.text--darken-1(v-else) {{menu.name}}
      tree-menu(:router="menu.children")
</template>

<script>

export default {
  name: 'TreeMenu',
  props: ['router'],
  data: () => ({
    //
  })
}
</script>
