<template lang="pug">
  .order-terms-edit
    v-dialog(v-model="show", :max-width="maxWidth", persistent)
      v-card
        v-card-title(primary-title)
          .headline.lighten-2 {{ edit ? '编辑' : '添加' }}数据
          v-spacer
          v-btn(icon,  @click="handleClose", color="error")
            v-icon mdi-close
        v-card-text
          v-container(grid-list-md)
            v-form(:ref="formRef")
              v-layout(wrap, style="width:100%")
                v-flex(sm12, md6)
                  v-text-field(v-model="editItem.name" :ref="`${formRef}name`", label="条款名称",
                    :rules="rules.unionRules(rules.requiredRules('条款名称'))")
                v-flex(sm12, md6)
                  v-text-field(v-model="editItem.code" :ref="`${formRef}code`", label="条款编号",
                    :rules="rules.unionRules(rules.requiredRules('条款编号'))")
                v-flex(sm12, md6)
                  v-text-field(v-model="editItem.type" :ref="`${formRef}type`", label="条款类型",
                    :rules="rules.unionRules(rules.requiredRules('条款类型'))")
                v-flex(sm12, md6)
                  v-text-field(v-model="editItem.sort" :ref="`${formRef}sort`", label="排序",
                    :rules="rules.unionRules(rules.requiredRules('排序'))", type="number")
                v-flex(sm12)
                  v-textarea(v-model="editItem.detail", label="条款内容", rows="5", :ref='`${formRef}detail`', auto-grow, counter,
                    :rules="rules.unionRules(rules.requiredRules('条款内容'))")
                v-flex(sm12)
                  v-textarea(v-model="editItem.description", label="说明", rows="2", :ref='`${formRef}description`', auto-grow, counter)
        v-card-actions
          v-spacer
          v-btn(outlined, color="error", @click="handleReset") 重置
          v-btn(outlined, color="success", @click="handleSubmit") {{ edit ? '保存修改' : '添加' }}
</template>

<script>
import * as RuleAPI from '_u/rule'

export default {
  name: 'OrderTermsEdit',
  props: {
    value: {
      type: Object,
      default: () => null
    },
    maxWidth: {
      type: String,
      default: '600px'
    }
  },
  data: () => ({
    show: false,
    defaultItem: {
      name: '',
      code: '',
      type: '',
      detail: '',
      description: '',
      sort: 1
    },
    editItem: {},
    edit: false,
    formRef: ''
  }),
  computed: {
    rules () {
      return RuleAPI
    }
  },
  mounted () {
    this.initData()
  },
  watch: {
    value () {
      this.initData()
    }
  },
  methods: {
    initData () {
      this.edit = this.value !== null
      this.formRef = this.value !== null ? 'edit' : 'add'
      if (this.edit) this.editItem = this._.cloneDeep(this.value)
      else this.editItem = this._.cloneDeep(this.defaultItem)
      if (typeof (this.$refs[this.formRef]) !== 'undefined') this.$refs[this.formRef].resetValidation()
    },
    handleClose () {
      this.show = false
      this.$refs[this.formRef].resetValidation()
    },
    handleReset () {
      this.initData()
      this.$refs[this.formRef].resetValidation()
    },
    handleSubmit () {
      if (!this.$refs[this.formRef].validate(true)) return
      this.$emit('submit', this.editItem)
      this.handleClose()
    },
    handleShow () {
      this.show = true
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
