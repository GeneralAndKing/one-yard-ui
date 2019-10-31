<template lang="pug">
  v-app
    v-app-bar(app)
      v-toolbar-title.headline.text-uppercase
        span Vuetify
        span.font-weight-light MATERIAL DESIGN
      v-spacer
      v-btn(text, href="https://github.com/vuetifyjs/vuetify/releases/latest", target="_blank")
        span.mr-2 Latest Release
    v-content
      HelloWorld
</template>

<script>
import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data: () => ({
    //
  })
}
</script>
