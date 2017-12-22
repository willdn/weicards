<template>
  <modal
    name="sellCardModal"
    height="auto"
    :adaptive="true"
    @before-open="beforeOpen"
    @closed="closed">
    <div v-if="!txWait" class="sell-card-modal">
      <div v-if="card" class="ui container center aligned">
        <h2 class="ui header">
          <i class="fa fa-dollar-sign"></i>
          Sell
          <router-link target="_blank" :to="{ name: 'CardDetails', params: { id: card.id } }"
            :data-tooltip="`View card #${card.id} details`" data-inverted="" data-position="right center">
            #{{ card.id }}
          </router-link>
        </h2>
      </div>
      <div class="ui container">
        <!-- Errors -->
        <div v-if="sellPrice != null && !formValid" class="ui error message">
          Price should be <b>greater or equal to 0.005 Ether</b>.
        </div>
        <form class="ui form">
          <div class="field">
            <label>Sell price</label>
            <div class="ui right labeled input">
              <div class="ui label">
                <i class="fa fa-dollar-sign"></i>
              </div>
              <input type="number" v-model="sellPrice" name="sellPrice" placeholder="Enter price" autocomplete="off">
              <div class="ui label">
                Ether
              </div>
            </div>
          </div>
          <div v-if="card && sellPrice" class="ui basic segment center aligned">
            Sell <b>card #{{ card.id }}</b> for <b>{{ sellPrice }} Ether</b> ?
          </div>
          <!-- Actions -->
          <div class="ui segment basic center aligned">
            <button class="ui green button"
              :class="{ 'disabled': sellPrice == null || !formValid }"
              @click.prevent="sellCard()">
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
import BigNumber from 'bignumber.js'
import TxLoader from '@/components/layouts/TxLoader'
import { successNotification, transactionDeniedNotif } from '@/api'
import Card from '@/api/Card'

export default {
  name: 'sellCardModal',
  components: {
    TxLoader
  },
  data () {
    return {
      card: null,
      sellPrice: null,
      txWait: false
    }
  },
  computed: {
    formValid () {
      return (this.sellPrice >= 0.005)
    }
  },
  methods: {
    sellCard () {
      if (!this.formValid) return false
      this.txWait = true
      const amount = new BigNumber(this.sellPrice).toNumber().toString()
      const card = Card.getById(this.card.id)
      /* global web3 */
      card.setSell(web3.utils.toWei(amount, 'ether'))
        .then((txHash) => {
          this.txWait = false
          successNotification(`<b>Card #${card.id}</b> listed on sale !`)
          this.closeModal()
        })
        .catch((err) => {
          console.log(err.message)
          transactionDeniedNotif(err.message)
          this.txWait = false
        })
    },
    closeModal () {
      this.$modal.hide('sellCardModal')
    },
    beforeOpen (event) {
      if (event.params === undefined) return false
      this.card = event.params.card
    },
    closed (event) {
      this.txWait = false
      this.sellPrice = null
    }
  }
}
</script>
<style scoped>
.sell-card-modal {
  padding: 1.5em;
}
</style>
