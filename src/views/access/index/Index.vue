<template lang="pug">

</template>

<script>

export default {
  name: 'Index',
  created () {
    this.$message({ content: '你当前的权限为访客权限,请联系管理员', type: 'error', timeout: 100000 })
  }
}
</script>
