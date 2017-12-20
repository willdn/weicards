<template>
  <div class="ui container">
    <!-- Loader -->
    <loader v-if="!cardsLoaded && !networkUnknown" />
    <!-- Cards -->
    <div v-if="cardsLoaded" class="ui link four stackable cards">
      <card v-for="i in cardsList.length" :key="i" :index="i"></card>
    </div>
    <!-- Wrong network -->
    <div v-if="networkUnknown" class="ui segment center aligned">
      <img class="ui image centered tiny" :src="require('@/assets/images/metamask.png')" /><br />
      Select <b>Main Ethereum Network</b> in MetaMask to display cards
    </div>
  </div>
</template>

<script>
import Card from './Card'
import Loader from '@/components/layouts/Loader'
import config from '@/config'

export default {
  name: 'main',
  components: {
    Loader,
    Card
  },
  data () {
    return {
      config: config,
      cardsLoaded: false
    }
  },
  watch: {
    cardsList (value) {
      if (value.length >= config.cardsNumber) {
        this.cardsLoaded = true
      } else {
        this.cardsLoaded = false
      }
    }
  },
  computed: {
    cardsList () {
      return this.$store.getters.cards
    },
    networkUnknown () {
      return this.$store.getters.networkUnknown
    }
  },
  methods: {
  },
  mounted () {
    // Force cards loaded when mounted
    if (this.cardsList.length >= config.cardsNumber) {
      this.cardsLoaded = true
    }
  }
}
</script>

<style scoped>
.cards {
  margin-top: 0.3em;
}
.container {
  max-width: 978px !important;
}
</style>
