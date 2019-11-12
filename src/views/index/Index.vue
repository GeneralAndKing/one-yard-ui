<template lang="pug">
    a 菠菜 贱卖！ 菠菜 贱卖！！ 菠菜！！！ 菠菜！！！！
</template>

<script>

import { Role } from '_u/role'

export default {
  name: 'Index',
  created () {
    if (this.$store.getters['auth/role'] === Role.ROLE_ACCESS) {
      this.$message({ content: '你当前的权限为访客权限,请联系管理员!', type: 'error', timeout: 100000 })
    }
  }
}
</script>
