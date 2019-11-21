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
                v-btn(:color="item.color", class="mx-0", outlined, href="https://generalandking.github.io/one-yard-ui/", target="_blank") {{item.button}}
</template>

<script>

import { Role } from '_u/role'

export default {
  name: 'Index',
  data: () => ({
    items: [
      {
        color: 'red lighten-2',
        icon: 'mdi-star mdi-spin',
        title: '第一步： 注册登陆获得权限及修改用户信息',
        content: '首次注册登陆后进入系统时账户为游客权限，需要联系管理员分配权限后重新登录才可进行对应的操作。每个用户都可点击系统右上角的下拉选项中的‘个人设置’进行个人信息的编辑修改，同时右上角还以查看通知信息以及改变系统主题。',
        button: '了解>>'
      },
      {
        color: 'purple darken-1',
        icon: 'mdi-book-variant',
        title: '第二步： 物料需求计划的创建管理及审批',
        content: '每个部门的提报员都可以在菜单‘需求计划创建’中创建物资需求计划，并可在‘需求计划管理’中对这些创建的计划进行管理和提交审批。每个部门的主管（除采购部门）都可以在用户管理中对自己部门下的账户进行权限和信息的更改，以及在‘需求计划管理’中需求计划进行查看和审批，审批的结果会通过通知发送在提报员账户上，审批通过的计划会根据年月份自动汇总（紧急计划不进入采购流程！）。',
        button: '了解>>'
      },
      {
        color: 'green lighten-1',
        icon: 'mdi-airballoon',
        title: '第三步： 物资供应方案的编制以及生成采购计划',
        content: '拥有采购计划员权限的用户可以在左侧菜单的‘物资供应方案’中对已经自动汇总的计划的物资根据年份加月份进行查询。并对这些物资数据审查后进行需求退回（需求退回分为针对单据/单条物资的退回）、拆分、合并、并可以添加采购部需要采购的物资（注：合并和拆分的数据不可以再退回）。填补完整采购方式、数量等数据后，选择对应的数据并点击‘生成采购计划’，系统检测无误则生成采购计划表。',
        button: '了解>>'
      },
      {
        color: 'indigo',
        icon: 'mdi-buffer',
        title: '第四步： 采购计划表的管理和审批',
        content: '采购计划员可以在左侧菜单‘采购计划管理’中查看自己生成的采购计划，并进行查看、编辑、提交审批、撤回审批等操作进行全程追踪。采购部门主管和财务部的管理可以在此对相应状态的采购计划进行审批并返回通知和审批信息。',
        button: '了解>>'
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
