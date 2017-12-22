<template>
  <modal
    name="setLeaseOfferModal"
    height="auto"
    :adaptive="true"
    @before-open="beforeOpen"
    @closed="closed">
    <div v-if="!txWait" class="set-lease-modal">
      <div v-if="card" class="ui container center aligned">
        <h2 class="ui header">
          <i class="fa fa-key"></i>
          Rent out
          <router-link target="_blank" :to="{ name: 'CardDetails', params: { id: card.id } }"
            :data-tooltip="`View card #${card.id} details`" data-inverted="" data-position="right center">
            #{{ card.id }}
          </router-link>
        </h2>
      </div>
      <div class="ui container">
        <form class="ui form">
          <div class="field">
            <label>Price</label>
            <div class="ui right labeled input">
              <div class="ui label">
                <i class="fa fa-dollar-sign"></i>
              </div>
              <input type="text" v-model="leaseForm.pricePerBlock" name="pricePerBlock" placeholder="Enter price per block"
                     autocomplete="off">
              <div class="ui label">
                Wei/block
              </div>
            </div>
          </div>
          <div class="field">
            <label>Duration</label>
            <div class="ui right labeled input">
              <div class="ui label">
                <i class="fa fa-clock"></i>
              </div>
              <input type="text" v-model="leaseForm.leaseDuration" name="leaseDuration" placeholder="Enter number of block of the rent duration"
                     autocomplete="off">
              <div class="ui label">
                blocks
              </div>
            </div>
          </div>
          <!-- Details -->
          <div class="ui segment basic grid equal width">
            <div v-if="totalAmountEther" class="row">
              <div class="column">Total amount</div>
              <div class="column">
                <i v-if="totalAmountEther < config.minLeaseAmount" class="fa fa-exclamation-circle error-exclamation"></i>
                {{ totalAmountEther }} Ether
              </div>
            </div>
            <div v-if="estimatedTime" class="row">
              <div class="column">Estimated lease end</div>
              <div class="column">{{ estimatedTime.fromNow() }} ({{ estimatedTime.format('LL') }})</div>
            </div>
          </div>
          <!-- Actions -->
          <div class="ui segment basic center aligned">
            <button class="ui green button"
              :class="{ 'disabled': !validForm }"
              @click.prevent="setLease()">
              <i class="fa fa-check"></i>
              Confirm
            </button>
            <button class="ui basic button"
              @click.prevent="closeModal()">
              <i class="fa fa-times"></i>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Waiting MetaMask -->
    <tx-loader :wait="txWait" />
  </modal>
</template>

<script>
import TxLoader from '@/components/layouts/TxLoader'
import BigNumber from 'bignumber.js'
import Card from '@/api/Card'
import config from '@/config'
import { successNotification, transactionDeniedNotif } from '@/api'
import moment from 'moment'

export default {
  name: 'setLeaseOfferModal',
  components: {
    TxLoader
  },
  data () {
    return {
      config: config,
      card: null,
      leaseForm: {
        pricePerBlock: null,
        leaseDuration: null
      },
      txWait: false
    }
  },
  computed: {
    contract () {
      return this.$store.getters.contract
    },
    currentAddress () {
      return this.$store.getters.currentAddress
    },
    totalAmount () {
      let pricePerBlock = new BigNumber(this.leaseForm.pricePerBlock)
      let leaseDuration = new BigNumber(this.leaseForm.leaseDuration)
      return pricePerBlock.times(leaseDuration)
    },
    totalAmountEther () {
      if (this.nullOrEmpty(this.leaseForm.pricePerBlock) || this.nullOrEmpty(this.leaseForm.leaseDuration)) return null
      /* global web3 */
      return web3.utils.fromWei(this.totalAmount.toNumber().toString(), 'ether')
    },
    estimatedTime () {
      if (this.leaseForm.leaseDuration == null) return null
      if (this.leaseForm.leaseDuration === '') return null
      const blockTime = 15
      let totalTimeSecond = this.leaseForm.leaseDuration * blockTime
      return moment().add(totalTimeSecond, 's')
    },
    validForm () {
      return (this.totalAmountEther >= config.minLeaseAmount && !this.nullOrEmpty(this.leaseForm.pricePerBlock) &&
               !this.nullOrEmpty(this.leaseForm.leaseDuration))
    }
  },
  methods: {
    nullOrEmpty (value) {
      return (value == null || value === '')
    },
    setLease () {
      if (!this.validForm) return false
      const card = Card.getById(this.card.id)
      this.txWait = true
      card.setLeaseOffer(new BigNumber(this.leaseForm.pricePerBlock), new BigNumber(this.leaseForm.leaseDuration))
        .then((txHash) => {
          this.txWait = false
          successNotification(`<b>Card #${card.id}</b> added to leases list !`)
          this.closeModal()
        })
        .catch((err) => {
          console.log(err.message)
          transactionDeniedNotif(err.message)
          this.txWait = false
        })
    },
    closeModal () {
      this.$modal.hide('setLeaseOfferModal')
    },
    beforeOpen (event) {
      if (event.params === undefined) return false
      this.card = event.params.card
    },
    closed (event) {
      this.txWait = false
      this.leaseForm.pricePerBlock = null
      this.leaseForm.leaseDuration = null
    }
  }
}
</script>
<style scoped>
.set-lease-modal {
  padding: 1.5em;
}
</style>
