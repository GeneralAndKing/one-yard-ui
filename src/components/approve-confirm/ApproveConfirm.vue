<template lang="pug">
  .approve-confirm
    v-dialog(v-model="dialog", max-width="350px")
      v-card(:loading="loading")
        v-card-title.headline
          span.title {{title}}
          v-spacer
          v-btn(text, color="error", icon, @click="handleClose")
            v-icon mdi-close
        v-card-text
          slot
            v-textarea(label="审批意见", hint="请输入您的审批意见", :rules="rules.union(rules.required('审批意见'))",
              rows="5", ref='description', auto-grow, counter, @input="handleInput")
        v-card-actions
          v-spacer
          v-btn(outlined, color="error", @click="handleApproval(false)") {{cancelText}}
          v-btn(outlined, color="success", @click="handleApproval(true)") {{okText}}

</template>

<script>
import { requiredRules, unionRules } from '_u/rule'

export default {
  name: 'ApproveConfirm',
  props: {
    value: { type: String, default: '' },
    title: { type: String, default: '' },
    okText: { type: String, default: '需求通过' },
    cancelText: { type: String, default: '需求退回' },
    auto: { type: Boolean, default: true }
  },
  data: () => ({
    rules: {
      required: requiredRules,
      union: unionRules
    },
    loading: false,
    dialog: false
  }),
  methods: {
    handleApproval (flag) {
      if (typeof (this.$refs.description) !== 'undefined' && !this.$refs.description.validate(true)) return
      this.$emit('submit', flag)
      if (this.auto) this.handleClose()
    },
    handleClose () {
      this.dialog = false
      typeof (this.$refs.description) !== 'undefined' && this.$refs.description.resetValidation()
    },
    handleInput (value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
