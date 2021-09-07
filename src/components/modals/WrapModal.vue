<template>
  <modal
    name="wrapModal"
    height="auto"
    :adaptive="true"
    @before-open="beforeOpen"
    @closed="closed">
    <div v-if="!txWait" class="wrap-modal">
      <div v-if="card" class="ui segment basic center aligned">
        <h2 class="ui header">
          Wrap card #{{ card.id }}
        </h2>
      </div>
      <!-- Actions -->
      <!-- Step 1 Actions -->
      <div v-if="!txWait && card && !card.isWrapped() && card.wrapStatus === null" class="ui segment basic center aligned" style="margin-top: 0em;">
        <div class="ui container" style="margin-bottom: 0.75em;">
          Step 1/3: Prepare card #{{ card.id }} to wrap
        </div>
        <button class="ui green button" @click.prevent="claimCard()">
          <i class="fa fa-check"></i>
          Confirm
        </button>
        <button class="ui basic button"
          @click.prevent="closeModal()">
          <i class="fa fa-times"></i>
          Cancel
        </button>
      </div>

      <!-- Step 2 Actions -->
      <div v-if="!txWait && card && !card.isWrapped() && card.wrapStatus === 'claimed'" class="ui segment basic center aligned" style="margin-top: 0em;">
        <div class="ui container" style="margin-bottom: 0.75em;">
          Step 2/3: Transfer card #{{ card.id }} to wrapper contract.
        </div>
        <button class="ui green button" @click.prevent="transferOwnership()">
          <i class="fa fa-check"></i>
          Confirm
        </button>
        <button class="ui basic button"
          @click.prevent="closeModal()">
          <i class="fa fa-times"></i>
          Cancel
        </button>
      </div>

      <!-- Step 3 Actions -->
      <div v-if="!txWait && card && !card.isWrapped() && card.wrapStatus === 'transferred'" class="ui segment basic center aligned" style="margin-top: 0em;">
        <div class="ui container" style="margin-bottom: 0.75em;">
          Step 3/3: Wrap Card #{{ card.id }}
        </div>
        <button class="ui green button" @click.prevent="wrapCard()">
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
    <!-- Waiting MetaMask -->
    <tx-loader :wait="txWait" />
  </modal>
</template>

<script>
import TxLoader from '@/components/layouts/TxLoader'
import { successNotification, transactionDeniedNotif } from '@/api'
import Card from '@/api/Card'
import app from '../../App'

export default {
  name: 'wrapModal',
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
    claimCard () {
      const card = Card.getById(this.card.id)
      this.txWait = true
      card.claim()
        .then((txHash) => {
          this.txWait = false
          successNotification(`<b>Card #${card.id}</b> is claimed`)
          card.wrapStatus = 'claimed'
        })
        .catch((err) => {
          console.log(err.message)
          transactionDeniedNotif(err.message)
          this.txWait = false
        })
    },
    transferOwnership () {
      const card = Card.getById(this.card.id)
      this.txWait = true
      card.transferOwnership(app.currentNetworkConfig.wrapContractAddress)
        .then((txHash) => {
          this.txWait = false
          successNotification(`<b>Card #${card.id}</b> ownership transfered to !`)
          card.wrapStatus = 'transferred'
        })
        .catch((err) => {
          console.log(err.message)
          transactionDeniedNotif(err.message)
          this.txWait = false
        })
    },
    wrapCard () {
      const card = Card.getById(this.card.id)
      this.txWait = true
      card.wrap()
        .then((txHash) => {
          this.txWait = false
          successNotification(`<b>Card #${card.id}</b> is wrapped`)
          card.wrapStatus = null
          this.closeModal()
        })
        .catch((err) => {
          console.log(err.message)
          transactionDeniedNotif(err.message)
          this.txWait = false
        })
    },
    closeModal () {
      this.$modal.hide('wrapModal')
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
.wrap-modal {
  padding: 1.5em;
}
</style>
