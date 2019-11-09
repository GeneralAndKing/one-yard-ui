<template lang="pug">
    div
        v-list(v-for="(menu,index) in router" :key="index")
            v-list-item(v-if="!menu.children"  :to="menu.to"
            )
                v-list-item-action
                    v-icon {{ menu.icon }}
                v-list-item-content
                    v-list-item-title {{menu.text}}
            v-list-group(v-else
            sub-group
            value="true")
                template(v-slot:activator)
                    v-list-item-content
                        v-list-item-title {{menu.name}}
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
