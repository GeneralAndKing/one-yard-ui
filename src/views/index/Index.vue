<template lang="pug">
    v-card.one-index.px-md-9
      v-card-text
        v-timeline(:dense="$vuetify.breakpoint.smAndDown")
          v-timeline-item(color="purple lighten-2", fill-dot, right)
            v-card
              v-card-title.purple.lighten-2
                v-icon.mr-4(dark, size="42") mdi-magnify
                h2.display-1.white--text.font-weight-light Title 1
              v-container
                v-row
                  v-col(cols="12" md="10") Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit.
                  v-col.hidden-sm-and-down.text-right(md="2")
                    v-icon(size="64") mdi-calendar-text
          v-timeline-item(color="amber lighten-1", fill-dot, left, small)
            v-card
              v-card-title.amber.lighten-1.justify-end
                h2.display-1.mr-4.white--text.font-weight-light Title 2
                v-icon(dark, size="42") mdi-home-outline
              v-container
                v-row
                  v-col(cols="12" md="8") Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit.
                  v-col(cols="12" md="4") Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit.
          v-timeline-item(color="cyan lighten-1", fill-dot, right)
            v-card
              v-card-title.cyan.lighten-1
                v-icon.mr-4(dark, size="42") mdi-email-outline
                h2.display-1.white--text.font-weight-light Title 3
              v-container
                v-row
                  v-col( v-for="n in 3", :key="n", cols="12", md="4") Lorem ipsum dolor sit amet, no nam oblique veritus no nam oblique.
          v-timeline-item(color="red lighten-1", fill-dot, left, small)
            v-card
              v-card-title.red.lighten-1.justify-end
                h2.display-1.mr-4.white--text.font-weight-light Title 4
                v-icon(dark, size="42") mdi-account-multiple-outline
              v-container
                v-row
                  v-col.hidden-sm-and-down(md="2")
                    v-icon(size="64") mdi-server-network
                  v-col(cols="12" md="10") Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit, an vim zril disputando voluptatibus.
          v-timeline-item(color="green lighten-1", fill-dot, right)
            v-card
              v-card-title.green.lighten-1
                v-icon.mr-4(dark, size="42") mdi-phone-in-talk
                h2.display-1.white--text.font-weight-light Title 5
              v-container
                v-row
                  v-col  Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit, an vim zril disputando voluptatibus, vix an salutandi sententiae.
</template>

<script>

export default {
  name: 'Index',
  created () {

  }
}
</script>
