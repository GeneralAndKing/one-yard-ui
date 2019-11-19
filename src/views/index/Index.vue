<template lang="pug">
    v-card.one-index.px-md-9
      v-card-text
        v-timeline(align-top, :dense="$vuetify.breakpoint.smAndDown")
          v-timeline-item( v-for="(item, i) in items"
            :key="i"
            :color="item.color"
            :icon="item.icon"
            fill-dot)
            v-card(:color="item.color", dark)
              v-card-title.title {{item.title}}
              v-card-text.white.text--primary.pt-2
                p {{item.content}}
                v-btn(:color="item.color", class="mx-0", outlined) {{item.button}}
</template>

<script>

import { Role } from '_u/role'

export default {
  name: 'Index',
  data: () => ({
    items: [
      {
        color: 'red lighten-2',
        icon: 'mdi-star',
        title: 'Lorem Ipsum Dolor',
        content: 'Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit, an vim zril disputando voluptatibus, vix an salutandi sententiae.',
        button: 'Button'
      },
      {
        color: 'purple darken-1',
        icon: 'mdi-book-variant',
        title: 'Lorem Ipsum Dolor',
        content: 'Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit, an vim zril disputando voluptatibus, vix an salutandi sententiae.',
        button: 'Button'
      },
      {
        color: 'green lighten-1',
        icon: 'mdi-airballoon',
        title: 'Lorem Ipsum Dolor',
        content: 'Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit, an vim zril disputando voluptatibus, vix an salutandi sententiae.',
        button: 'Button'
      },
      {
        color: 'indigo',
        icon: 'mdi-buffer',
        title: 'Lorem Ipsum Dolor',
        content: 'Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit, an vim zril disputando voluptatibus, vix an salutandi sententiae.',
        button: 'Button'
      }
    ]
  }),
  created () {
    if (this.$store.getters['auth/role'].length === 1 && this.$store.getters['auth/role'].includes(Role.ROLE_ACCESS)) {
      this.$message({ content: '你当前为游客权限,请联系管理员', timeout: 0, x: 'left' })
    }
  }
}
</script>
