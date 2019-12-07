<template lang="pug">
  .one-order-terms
    v-data-table(v-model="selected", :headers="headers", :items="value", no-data-text="暂无数据", no-results-text="暂无数据",
      :mobile-breakpoint="900", show-select, item-key="code", :search="search", :loading="loading")
      template(v-slot:item.action="{ item }")
        v-tooltip(top)
          template(v-slot:activator="{ on }")
            v-btn.mr-1(outlined, rounded, x-small, fab, color="info", @click="handleEdit(item)", v-on="on", :disabled="see")
              v-icon mdi-pencil
          span 编辑
        v-tooltip(top)
          template(v-slot:activator="{ on }")
            v-btn(outlined, rounded, x-small, fab, color="error", @click="handleDelete(item)", v-on="on", :disabled="see")
              v-icon mdi-delete
          span 删除
      template(v-slot:top)
        v-toolbar(flat, style="overflow: auto;")
          v-toolbar-title
            p.grey--text 当前订单的条款明细
          v-spacer
          v-text-field.mr-4(
            v-model="search",
            append-icon="search",
            label="请输入关键字以查找",
            single-line,
            hide-details,
            style="display: block ruby;"
          )
          v-btn.mr-4(outlined, color="success", @click="handleAdd", :disabled='see') 添加
          v-btn(outlined, color="error", @click="handleDeleteSelect", :disabled='see') 删除所选
    order-terms-edit(ref="add", v-model="item", @submit="handleSubmit")
</template>

<script>
import OrderTermsEdit from './OrderTermsEdit'
export default {
  name: 'OrderTerms',
  components: {
    OrderTermsEdit
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    see: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    item: null,
    selected: [],
    search: '',
    headers: [
      { text: '排序', value: 'sort', align: 'start' },
      { text: '条款名称', value: 'name', align: 'start' },
      { text: '条款编号', value: 'code', align: 'start' },
      { text: '条款类型', value: 'type', align: 'start' },
      { text: '条款内容', value: 'content', align: 'start' },
      { text: '说明', value: 'description', align: 'start' },
      { text: '操作', value: 'action', sortable: false, width: '150px', align: 'center' }
    ]
  }),
  created () {
  },
  methods: {
    handleAdd () {
      this.item = null
      this.$refs.add.handleShow()
    },
    handleDeleteSelect () {
      // TODO： 删除所选事件
      this.selected.forEach(item => this.value.splice(this._.indexOf(this.value, item), 1))
      this.selected = []
    },
    handleDelete (item) {
      // TODO: 删除事件
      this.value.splice(this._.indexOf(this.value, item), 1)
    },
    handleEdit (item) {
      this.item = item
      this.$refs.add.handleShow()
    },
    // 这个事件是添加或者编辑成功以后，添加到表格之中的事件
    // 参数是修改后的元素，原来的元素是 this.item
    handleSubmit (item) {
      if (this.item === null) {
        // 添加成功
        // 添加一个不重复的主键
        this.value.unshift(item)
      } else {
        // 编辑成功
        this.value.splice(this._.indexOf(this.value, this.item), 1, item)
      }
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
