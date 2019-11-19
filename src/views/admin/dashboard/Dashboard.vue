<template lang="pug">
  v-container#auth-dashboard
    v-layout(wrap)
      v-flex(xs12, sm12, md6, lg6, v-for="chart in charts", :key="chart.title")
        ChartCard(:title="chart.title", :subTitle="chart.subTitle", :icon="chart.icon",
          :description="chart.description", :value="chart.value", :labels="chart.labels",
          :color="chart.color")
    v-layout(wrap)
      v-flex.v-text-field--full-width(xs12, sm6, md6, lg3, v-for="item in statistical", :key="item.subTitle")
        DataCard(:subTitle="item.subTitle", :main="item.main",
          :icon="item.icon", :iconColor="item.iconColor",
          :actionIcon="item.actionIcon", :action="item.action"
          :iconSize="item.iconSize")
</template>

<script>
import DataCard from '_c/data-card'
import ChartCard from '_c/chart-card'
import * as restAPI from '_api/rest'

export default {
  name: 'Dashboard',
  components: {
    DataCard,
    ChartCard
  },
  data: () => ({
    statistical: [
      {
        subTitle: '用户总数',
        main: '0',
        icon: 'color_lens',
        iconColor: 'orange',
        actionIcon: 'vpn_key',
        iconSize: 56,
        action: '当前系统中未锁定的用户总数'
      }, {
        subTitle: '物料总数',
        main: '0',
        icon: 'check_circle_outline',
        iconColor: 'green',
        actionIcon: 'vpn_key',
        action: '所有物料分类下的物料总数'
      }, {
        subTitle: '需求计划处理量',
        main: '0',
        icon: 'verified_user',
        iconColor: 'blue',
        actionIcon: 'vpn_key',
        action: '已经处理的需求计划总数'
      }, {
        subTitle: '采购计划待执行量',
        main: '0',
        icon: 'error_outline',
        iconColor: 'red',
        actionIcon: 'vpn_key',
        action: '待执行的采购计划总数'
      }
    ],
    charts: [
      {
        title: '接口请求次数',
        subTitle: '通过请求次数你可以更好的了解系统流量',
        icon: 'verified_user',
        description: '当前服务器指定日期接受到的请求总次数',
        value: [ 200, 675, 410, 390, 310, 460, 250, 240 ],
        labels: [ '12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm' ]
      },
      {
        title: '授权次数',
        subTitle: '通过授权次数能够从另一方面反映出您系统的安全性',
        icon: 'verified_user',
        color: 'blue',
        description: '每当登录、授权、鉴权的时候都会触发此请求',
        value: [ 200, 675, 410, 390, 310, 460, 250, 240 ],
        labels: [ '12am', '3am', '6am', '9am', '12pm', '3pm', '6pm' ]
      }
    ]
  }),
  created () {
    restAPI.getRestLink('sysUser/search/count?status=NORMAL').then(res => { this.statistical[0].main = `${res.data}` })
    restAPI.getRestLink('material/search/count').then(res => { this.statistical[1].main = `${res.data}` })
    restAPI.getRestLink('materialDemandPlan/search/count').then(res => { this.statistical[2].main = `${res.data}` })
    restAPI.getRestLink(`procurementPlan/search/count?planStatus=FINALLY`).then(res => { this.statistical[3].main = `${res.data}` })
    restAPI.getLink('dashboard/api').then(res => { this.chartDate(res, 0) })
    restAPI.getLink('dashboard/auth').then(res => { this.chartDate(res, 1) })
  },
  methods: {
    chartDate (res, num) {
      let date = new Date()
      this.charts[num].labels = []
      this.charts[num].value = []
      for (let i = 1; i <= 7; i++) {
        const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        this.charts[num].labels.unshift(key.substr(5))
        if (res.data.hasOwnProperty(key)) this.charts[num].value.unshift(res.data[key])
        else this.charts[num].value.unshift(0)
        date = new Date(date - 1000 * 60 * 60 * 24)
      }
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
