<template lang="pug">
  v-container#auth-dashboard
    v-layout(wrap)
      v-flex(xs12, sm12, md6, lg6, v-for="chart in charts", :key="chart.title")
        ChartCard(:title="chart.title", :subTitle="chart.subTitle", :icon="chart.icon",
          :description="chart.description", :value="chart.value", :labels="chart.labels",
          :color="chart.color")
    v-layout(wrap)
      v-flex.v-text-field--full-width(xs12, sm6, md3, lg3, v-for="item in statistical", :key="item.subTitle")
        DataCard(:subTitle="item.subTitle", :main="item.main",
          :icon="item.icon", :iconColor="item.iconColor",
          :actionIcon="item.actionIcon", :action="item.action"
          :iconSize="item.iconSize")
</template>

<script>
import DataCard from '_c/data-card'
import ChartCard from '_c/chart-card'

export default {
  name: 'Dashboard',
  components: {
    DataCard,
    ChartCard
  },
  data: () => ({
    statistical: [
      {
        subTitle: '今日下发令牌',
        main: '1001',
        icon: 'verified_user',
        iconColor: 'blue',
        actionIcon: 'vpn_key',
        action: '哈啊哈哈'
      }, {
        subTitle: '用户总数',
        main: '1001',
        icon: 'color_lens',
        iconColor: 'orange',
        actionIcon: 'vpn_key',
        iconSize: 56,
        action: '哈啊哈哈'
      }, {
        subTitle: '请求成功次数',
        main: '1001',
        icon: 'check_circle_outline',
        iconColor: 'green',
        actionIcon: 'vpn_key',
        action: '哈啊哈哈'
      }, {
        subTitle: '请求失败次数',
        main: '1001',
        icon: 'error_outline',
        iconColor: 'red',
        actionIcon: 'vpn_key',
        action: '哈啊哈哈'
      }
    ],
    charts: [
      {
        title: '用户流量',
        subTitle: '通过用户流量你可以更好的了解用户信息',
        icon: 'verified_user',
        description: '这是一个测试！！！！',
        value: [ 200, 675, 410, 390, 310, 460, 250, 240 ],
        labels: [ '12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm' ]
      },
      {
        title: '测试',
        subTitle: '通过用户流量你可以更好的了解用户信息',
        icon: 'verified_user',
        color: 'blue',
        description: '这是一个测试！！！！',
        value: [ 200, 675, 410, 390, 310, 460, 250, 240 ],
        labels: [ '12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm' ]
      }
    ]
  })
}
</script>

<style scoped lang="stylus">

</style>
