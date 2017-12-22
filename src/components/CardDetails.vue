<template>
  <div class="ui container">
    <!-- Loader -->
    <loader v-if="!card" />
    <!-- Card Header -->
    <div v-if="card" class="ui basic segment fluid">
      <h1 class="ui header">
        <i class="far fa-address-card"></i>
        Card #{{ card.id }}
      </h1>
    </div>
    <div v-if="card" class="ui stackable grid">
      <!-- Card -->
      <div class="column four wide">
        <div class="ui link cards center aligned">
          <card :index="card.id"></card>
        </div>
      </div>
      <!-- Card details -->
      <div class="column twelve wide">
        <!-- Card details header -->
        <h3 class="ui header">
          <i class="fa fa-angle-double-right"></i>
          Details
        </h3>
        <div class="ui segment raised">
          <div class="ui grid equal width">
            <!-- ID -->
            <div class="row">
              <div class="column">#</div>
              <div class="column">{{ card.id }}</div>
            </div>
            <!-- Owner -->
            <div class="row">
              <div class="column">
                <i class="fa fa-user"></i> Owner
                  <span v-if="card.isOwner()" class="ui compact teal tiny label"
                     data-tooltip="That's you !" data-inverted="">You</span>
              </div>
              <div class="column">
                {{ (card.isBought()) ? card.getOwner() : 'None' }}
              </div>
            </div>
            <!-- Title -->
            <div class="row">
              <div class="column"><i class="fa fa-bars"></i> Title</div>
              <div class="column">
                <small v-if="card.inLeasing()" data-tooltip="This is tenant card title" data-inverted=""><i class="fa fa-key"></i></small>
                {{ (card.isBought()) ? card.getTitle() : 'None' }}
              </div>
            </div>
            <!-- URL -->
            <div class="row">
              <div class="column"><i class="fa fa-link"></i> URL</div>
              <div v-if="!card.isBought()" class="column">None</div>
              <div v-if="card.isBought()" class="column">
                <small v-if="card.inLeasing()" data-tooltip="This is tenant card URL" data-inverted=""><i class="fa fa-key"></i></small>
                <a :href="card.getURL()" target="_blank">{{ card.getURL() }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Settings if is card owner -->
    <h2 v-if="card && card.isOwner()" class="ui header">
      <i class="fa fa-cogs"></i>
      Settings
    </h2>
    <div v-if="card && card.isOwner()" class="ui raised segment stackable grid equal width center aligned">
      <a class="column red-hover" v-if="card.availableBuy" href=""
         @click.prevent="cancelSellCard()">
        <i class="fa fa-times"></i> Cancel sale
      </a>
      <a class="column red-hover" v-if="card.availableLease" href=""
         @click.prevent="cancelLeaseOffer()">
        <i class="fa fa-times"></i> Cancel lease
      </a>
      <a class="column green-hover" v-if="!card.availableBuy && !card.availableLease && !card.inLeasing()" href=""
         @click.prevent="sellCard()"
         >
        <i class="fa fa-dollar-sign"></i> Sell
      </a>
      <a class="column orange-hover" v-if="!card.availableBuy && !card.availableLease && !card.inLeasing()" href=""
         @click.prevent="setLeaseCard()">
        <i class="fa fa-key"></i> Rent out
      </a>
      <a class="column blue-hover" href=""
         @click.prevent="edit()">
        <i class="fa fa-wrench"></i> Edit
      </a>
      <a class="column teal-hover" href=""
         @click.prevent="transferOwnership()">
        <i class="fa fa-exchange-alt"></i> Transfer
      </a>
    </div>
    <!-- Leases -->
    <h2 v-if="card" class="ui header">
      <i class="fa fa-key"></i>
      Leases <small>({{ leases.length }})</small>
    </h2>
    <!-- Loader -->
    <loader v-if="card && !leasesLoaded" />
    <!-- No leases -->
    <div v-if="card && leasesLoaded && leases.length === 0" class="ui segment center aligned raised">
      Card <b>#{{ card.id }}</b> has not been leased yet
    </div>
    <!-- Leases history -->
    <table v-if="card && leasesLoaded && leases.length > 0" class="ui celled unstackable table">
      <thead><tr>
        <th>#</th>
        <th>Title</th>
        <th>Tenant</th>
        <th>URL</th>
        <th>End</th>
      </tr></thead>
      <tbody>
        <tr v-for="lease in leases" :key="lease.leaseIndex">
          <td>
            <div v-if="lease.untilBlock < blockNumber">{{ lease.leaseIndex }}</div>
            <div v-if="lease.untilBlock >= blockNumber" class="ui orange ribbon label">
              <i class="fa fa-star"></i>
            </div>
        </td>
          <td><img class="ui image avatar" :src="lease.image" /> {{ lease.title }}</td>
          <td>
          <span v-if="lease.tenant === currentAddress" class="ui compact teal tiny label"
                data-tooltip="That's you !" data-inverted="">You</span>
            {{ lease.tenant.substring(0, 15) }}...
          </td>
          <td><a :href="lease.url" target="_blank">{{ lease.url }}</a></td>
          <td>{{ leaseEndTime(lease.untilBlock).fromNow() }}</td>
        </tr>
      </tbody>
      <tfoot>
      </tfoot>
    </table>
    <!-- Modals -->
    <edit-modal></edit-modal>
    <transfer-ownership-modal></transfer-ownership-modal>
  </div>
</template>

<script>
import moment from 'moment'
import config from '@/config'
import Card from '@/components/Card'
import Loader from '@/components/layouts/Loader'
// Modals
import TransferOwnershipModal from '@/components/modals/TransferOwnershipModal'
import EditModal from '@/components/modals/EditModal'

export default {
  name: 'cardDetails',
  components: {
    Loader,
    Card,
    TransferOwnershipModal,
    EditModal
  },
  data () {
    return {
      id: null,
      card: null,
      leasesLoaded: false,
      leases: []
    }
  },
  watch: {
    // Wait for cards to be loaded
    cards (value) {
      if (value.length >= config.cardsNumber) {
        this.getCard()
      }
    },
    contract (value) {
      if (value != null) {
        this.buildLeasesList()
      }
    }
  },
  computed: {
    contract () {
      return this.$store.getters.contract
    },
    cards () {
      return this.$store.getters.cards
    },
    currentAddress () {
      return this.$store.getters.currentAddress
    },
    blockNumber () {
      return this.$store.getters.blockNumber
    }
  },
  methods: {
    getCard () {
      this.card = this.cards.find(c => c.id === this.id)
    },
    leaseEndTime (untilBlock) {
      const blockTime = 15
      let blockNumber = this.$store.getters.blockNumber
      let totalTimeSecond = (untilBlock - blockNumber) * blockTime
      return moment().add(totalTimeSecond, 's')
    },
    buildLeasesList () {
      this.getLeasesList()
        .then((leasesNumber) => {
          return leasesNumber
        })
        .then((leasesNumber) => {
          for (let i = 1; i <= leasesNumber; i++) {
            this.getLease(i)
              .then((lease) => {
                this.leases.push(lease)
              })
          }
          this.leasesLoaded = true
          return true
        })
    },
    getLeasesList () {
      return this.contract.methods.getCardLeaseLength(this.id)
        .call({ from: this.currentAddress })
        .then((leasesNumber) => {
          return leasesNumber
        })
    },
    getLease (leaseId) {
      return this.contract.methods.getLease(this.id, leaseId)
        .call({ from: this.currentAddress })
        .then((lease) => {
          return lease
        })
    },
    sellCard () {
      this.$modal.show('sellCardModal', {
        card: this.card
      })
    },
    cancelSellCard () {
      this.$modal.show('cancelSellOfferModal', {
        card: this.card
      })
    },
    setLeaseCard () {
      this.$modal.show('setLeaseOfferModal', {
        card: this.card
      })
    },
    cancelLeaseOffer () {
      this.$modal.show('cancelLeaseOfferModal', {
        card: this.card
      })
    },
    edit () {
      this.$modal.show('editModal', {
        card: this.card
      })
    },
    transferOwnership () {
      this.$modal.show('transferOwnershipModal', {
        card: this.card
      })
    }
  },
  mounted () {
    if (!this.$route.params.id) return false
    this.id = parseInt(this.$route.params.id)
    this.getCard()
    if (this.contract != null) {
      this.buildLeasesList()
    }
  }
}
</script>

<style scoped>
.cards {
  margin-top: 0.3em;
}
.column {
  color: rgba(0,0,0,.70) !important;
  overflow-wrap: break-word;
}
.container {
  max-width: 978px !important;
}
.orange-hover:hover {
  background-color: rgba(242, 113, 28, 0.2);
}
.green-hover:hover {
  background-color: rgba(33, 186, 69, 0.2) ;
}
.red-hover:hover {
  background-color: rgba(219, 40, 40, 0.2);
}
.teal-hover:hover {
  background-color: rgba(93, 160, 134, 0.2);
}
.blue-hover:hover {
  background-color: rgba(33, 133, 208, 0.2);
}
</style>
