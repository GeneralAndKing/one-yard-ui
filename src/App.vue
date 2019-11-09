<template lang="pug">
  v-app#inspire
    v-fade-transition
      router-view
</template>

<script>

export default {
  name: 'App',
  data: () => ({
    //
  })
}
</script>

<style>
html {
  overflow: auto !important;
}
</style>
