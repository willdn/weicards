<template>
  <div class="ui container">
    <div class="ui basic segment fluid">
      <h1 class="ui header">
        <i class="fa fa-user"></i>
        Sign in
      </h1>
    </div>
    <div class="ui segment raised">
      <h2 class="ui basic segment center aligned header">
        You will need <img class="ui image tiny" src="https://metamask.io/img/metamask.png" /> <a href="https://metamask.io/">MetaMask</a> to sign in
      </h2>
      <div class="ui basic segment">
      </div>
      <h3 class="ui header">
        What is MetaMask ?
      </h3>
      <p>MetaMask is a <a href="https://ethereum.org/">Ethereum</a> bridge that allows you to visit the distributed web of tomorrow in your browser today.
      It allows you to run DApps right in your browser without running a full Ethereum node.
      You don't understand any of this words ? Check out the <router-link :to="{ name: 'FAQ' }" >FAQ</router-link> !</p>
      <h3 class="ui header">
        Why do I need MetaMask ?
      </h3>
      <p>WeiCards is a Decentralized Application running on the Ethereum blockchain. The easiest way to interact with them is by using a small browser add-on.
      This will provide you a wallet where you can send some Ether (Ξ) and will be <b>your login access</b> to buy, lease and sell cards !</p>
      <div class="ui basic segment center aligned">
        <div class="ui large header">More questions ? Have a look at our <router-link :to="{ name: 'FAQ' }">FAQ</router-link></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'signIn',
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
</style>
