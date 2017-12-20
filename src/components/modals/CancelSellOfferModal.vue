<template>
  <modal
    name="cancelSellOfferModal"
    height="auto"
    :adaptive="true"
    @before-open="beforeOpen"
    @closed="closed">
    <div v-if="!txWait" class="sell-card-modal">
      <div v-if="card" class="ui segment basic center aligned">
        <h2 class="ui header">
          Cancel #{{ card.id }} sale ?
        </h2>
      </div>
      <!-- Lease details -->
      <div v-if="card" class="ui segment basic grid equal width center aligned">
        <div class="column">
          <h3 class="ui header">Ξ Total Amount</h3>
          <b>{{ card.buyPriceToEther() }}</b> Ether
        </div>
      </div>
      <!-- Actions -->
      <div class="ui container">
        <div class="ui segment basic center aligned">
          <button class="ui green button"
            @click.prevent="cancelSellOffer()">
            <i class="fa fa-check"></i>
            Confirm
          </button>
          <button class="ui basic button"
            @click.prevent="closeModal()">
            <i class="fa fa-times"></i>
            Cancel
          </button>
        </div>
      </div>
    </div>
    <!-- Waiting MetaMask -->
    <tx-loader :wait="txWait" />
  </modal>
</template>

<script>
import TxLoader from '@/components/layouts/TxLoader'
import { successNotification, transactionDeniedNotif } from '@/api'
import Card from '@/api/Card'

export default {
  name: 'cancelSellOfferModal',
  components: {
    TxLoader
  },
  data () {
    return {
      card: null,
      txWait: false
    }
  },
  computed: {
  },
  methods: {
    cancelSellOffer () {
      const card = Card.getById(this.card.id)
      this.txWait = true
      card.cancelSellOffer()
        .then((txHash) => {
          this.txWait = false
          successNotification(`<b>Card #${card.id}</b> removed from sales list !`)
          this.closeModal()
        })
        .catch((err) => {
          console.log(err.message)
          transactionDeniedNotif(err.message)
          this.txWait = false
        })
    },
    closeModal () {
      this.$modal.hide('cancelSellOfferModal')
    },
    beforeOpen (event) {
      if (event.params === undefined) return false
      this.card = event.params.card
    },
    closed (event) {
      this.txWait = false
    }
  }
}
</script>
<style scoped>
.sell-card-modal {
  padding: 1.5em;
}
</style>
