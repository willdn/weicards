<template>
  <div class="ui menu top-header">
    <router-link :to="{ name: 'Main' }" class="header item">
      WeiCards &nbsp;<i class="far fa-address-card"></i>
    </router-link>
    <div class="right menu">
      <div class="item">
        <span
          :data-tooltip="`${boughtCards.length} of 100 cards bought`"
          data-position="bottom center"
          style="z-index: 999"
        >
          <i class="far fa-address-card"></i>
          {{ boughtCards.length }}/100
        </span>
      </div>
      <router-link :to="{ name: 'FAQ', hash: '#how-it-works' }" class="item">
        <i class="fas fa-question"></i>
        How it works
      </router-link>
      <router-link v-if="currentAddress" :to="{ name: 'Account' }" class="item">
        <i class="fas fa-user"></i>
        {{ currentAddress.substring(0, 12) }}...
      </router-link>
      <v-btn
        v-if="!currentAddress"
        cli
        class="item account-btn"
        v-on:click="connectWallet"
      >
        <i class="fas fa-user"></i>
        Connect
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "navbar",
  data() {
    return {};
  },
  computed: {
    currentAddress() {
      return this.$store.getters.currentAddress;
    },
    blockNumber() {
      return this.$store.getters.blockNumber;
    },
    boughtCards() {
      return this.$store.getters.cards.filter((c) => c.isBought());
    },
  },
  methods: {
    connectWallet: async (_event) => {
      const [selectedAddress] = await window.ethereum.enable();
    },
  },
  mounted() {},
};
</script>

<style scoped>
.top-header {
  border-radius: 0em !important;
  background-color: rgba(255, 107, 74, 0.85) !important;
}
.item {
  border-radius: 0em !important;
  color: rgba(255, 255, 255, 0.858) !important;
}
a:hover {
  background-color: rgba(255, 255, 255, 0.98) !important;
  color: rgba(255, 107, 74, 0.9) !important;
}
</style>
