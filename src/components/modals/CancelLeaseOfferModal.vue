<template>
  <modal
    name="cancelLeaseOfferModal"
    height="auto"
    :adaptive="true"
    @before-open="beforeOpen"
    @closed="closed">
    <div v-if="!txWait" class="sell-card-modal">
      <div v-if="card" class="ui segment basic center aligned">
        <h2 class="ui header">
          Cancel #{{ card.id }} rent out ?
        </h2>
      </div>
      <!-- Lease details -->
      <div v-if="card" class="ui segment basic grid equal width center aligned">
        <div class="column">
          <h3 class="ui header">Ξ Total Amount</h3>
          <b>{{ card.getLeaseTotalAmount() }}</b> Ether
        </div>
        <div class="column">
          <h3 class="ui header"><i class="far fa-clock"></i> Duration</h3>
          <b>{{ parseInt(card.leaseDuration).toLocaleString() }}</b> blocks<br />
          </span>
        </div>
        <div class="column" style="word-wrap: break-word;">
          <h3 class="ui header"><i class="far fa-calendar"></i>End Date</h3>
          <b>{{ card.estimatedLeaseEnd().format('LL') }}</b><br />
          <i>({{ card.estimatedLeaseEnd().fromNow() }})</i>
        </div>
      </div>
      <!-- Actions -->
      <div class="ui container">
        <div class="ui segment basic center aligned">
          <button class="ui green button"
            @click.prevent="cancelLeaseOffer()">
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
  name: 'cancelLeaseOfferModal',
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
    cancelLeaseOffer () {
      const card = Card.getById(this.card.id)
      this.txWait = true
      card.cancelLeaseOffer()
        .then((txHash) => {
          this.txWait = false
          successNotification(`<b>Card #${card.id}</b> removed from leases list !`)
          this.closeModal()
        })
        .catch((err) => {
          console.log(err.message)
          transactionDeniedNotif(err.message)
          this.txWait = false
        })
    },
    closeModal () {
      this.$modal.hide('cancelLeaseOfferModal')
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
