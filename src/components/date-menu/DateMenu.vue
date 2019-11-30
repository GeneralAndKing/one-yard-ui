<template lang="pug">
  v-menu.one-data-menu(v-model="dateMenu", :close-on-content-click="false", transition="scale-transition",
    offset-y, max-width="290px", min-width="290px")
    template(v-slot:activator="{ on }")
      v-text-field(v-model="date", v-on="on", :label="label", readonly,
        :rules="requiredRule", :disabled="disabled")
    v-date-picker(v-model="initDate", no-title, @input="dateMenu = false", locale="zh-cn")

</template>

<script>
import { requiredRules, unionRules } from '_u/rule'

export default {
  name: 'DateMenu',
  props: {
    // 标签
    label: {
      type: String,
      required: true
    },
    // 类型，只有 日 和 月
    type: {
      type: String,
      default: 'day',
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['day', 'month'].indexOf(value) !== -1
      }
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否必填
    required: {
      type: Boolean,
      default: true
    },
    // 格式化日期
    formatDate: {
      type: Function,
      default: (date) => date
    }
  },
  data: () => ({
    dateMenu: false,
    date: '',
    rules: {
      required: requiredRules,
      union: unionRules
    },
    initDate: new Date().toISOString()
  }),
  computed: {
    requiredRule () {
      return this.required ? this.rules.union(this.rules.required(this.label)) : []
    }
  },
  watch: {
    initDate (val) {
      if (!val) return
      this.date = this.formatDate(val)
      this.$emit('input', this.date)
    }
  },
  created () {
    if (this.type === 'day') this.initDate = this.initDate.substring(0, 10)
    else if (this.type === 'month') this.initDate = this.initDate.substring(0, 7)
  }
}
</script>

<style scoped lang="stylus">

</style>
