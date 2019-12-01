<template lang="pug">
  .approve-confirm
    v-dialog(v-model="dialog", max-width="350px")
      v-card
        v-card-title.headline
          span.title {{title}}审批
          v-spacer
          v-btn(text, color="error", icon, @click="handleClose")
            v-icon mdi-close
        v-card-text
          v-textarea(label="审批意见", hint="请输入您的审批意见", :rules="rules.union(rules.required('审批意见'))",
            rows="5", ref='description', auto-grow, counter, @input="handleInput")
        v-card-actions
          v-spacer
          v-btn(outlined, color="error", @click="handleApproval(false)") 需求退回
          v-btn(outlined, color="success", @click="handleApproval(true)") 需求通过

</template>

<script>
import { requiredRules, unionRules } from '_u/rule'

export default {
  name: 'ApproveConfirm',
  props: {
    value: { type: String, required: true },
    title: { type: String, default: '' }
  },
  data: () => ({
    rules: {
      required: requiredRules,
      union: unionRules
    },
    dialog: false
  }),
  methods: {
    handleApproval (flag) {
      if (!this.$refs.description.validate(true)) return
      this.$emit('submit', flag)
      this.handleClose()
    },
    handleClose () {
      this.dialog = false
      this.$refs.description.resetValidation()
    },
    handleInput (value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
