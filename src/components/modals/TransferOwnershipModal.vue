<template>
  <modal
    name="transferOwnershipModal"
    height="auto"
    :adaptive="true"
    @before-open="beforeOpen"
    @closed="closed">
    <div v-if="!txWait" class="transfer-ownership-modal">
      <div v-if="card" class="ui segment basic center aligned">
        <h2 class="ui header">
          Transfer #{{ card.id }} ownership ?
        </h2>
      </div>
      <div class="ui red message">
        <b>This cannot be undone. Double-check the ownership recipient ! </b>
      </div>
      <form class="ui form">
        <div class="field">
          <label>New owner address</label>
          <div class="ui labeled input">
            <div class="ui label">
              <i class="fa fa-user"></i>
            </div>
            <input type="text" v-model="newOwnerAddress" name="newOwnerAddress" placeholder="Enter new owner address" autocomplete="off">
          </div>
        </div>
        <div v-if="card && newOwnerAddress" class="ui basic segment center aligned">
          Transfer <b>Card #{{ card.id }}</b> to <b>{{ newOwnerAddress }}</b> ?
        </div>
        <!-- Actions -->
        <div class="ui segment basic center aligned">
          <button class="ui green button"
            :class="{ 'disabled': newOwnerAddress == null }"
            @click.prevent="transferOwnership()">
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
    <!-- Waiting MetaMask -->
    <tx-loader :wait="txWait" />
  </modal>
</template>

<script>
import TxLoader from '@/components/layouts/TxLoader'
import { successNotification, transactionDeniedNotif } from '@/api'
import Card from '@/api/Card'

export default {
  name: 'transferOwnershipModal',
  components: {
    TxLoader
  },
  data () {
    return {
      card: null,
      txWait: false,
      newOwnerAddress: null
    }
  },
  computed: {
  },
  methods: {
    transferOwnership () {
      // TODO: Check if address is valid
      if (this.newOwnerAddress == null) return false
      const card = Card.getById(this.card.id)
      this.txWait = true
      card.transferOwnership(this.newOwnerAddress)
        .then((txHash) => {
          this.txWait = false
          successNotification(`<b>Card #${card.id}</b> ownership transfered to !`)
          this.closeModal()
        })
        .catch((err) => {
          console.log(err.message)
          transactionDeniedNotif(err.message)
          this.txWait = false
        })
    },
    closeModal () {
      this.$modal.hide('transferOwnershipModal')
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
.transfer-ownership-modal {
  padding: 1.5em;
}
</style>
