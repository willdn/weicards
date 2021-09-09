<template>
  <!-- Waiting MetaMask -->
  <div v-if="wait" class="tx-wait-modal">
    <div class="ui segment basic center aligned">
      <h2 class="ui header">
        Waiting for MetaMask <i class="fas fa-circle-notch fa-spin"></i>
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'txLoader',
  props: ['wait'],
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<style scoped>
.tx-wait {
  padding: 1.5em;
}
.subheader {
  color: rgba(0, 0, 0,.6) !important;
}
</style>
