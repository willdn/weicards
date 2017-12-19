<template>
  <modal
    name="unknownNetworkModal"
    height="auto"
    :adaptive="true">
    <div class="network-unknown-modal">
      <div class="ui basic segment center aligned">
        <h2 class="ui header">Connect to Main Ethereum Network</h2>
      </div>
    </div>
  </modal>
</template>

<script>

export default {
  name: 'unknownNetworkModal',
  data () {
    return {
    }
  }
}
</script>
<style scoped>
.network-unknown-modal {
  padding: 1.5em;
}
</style>
