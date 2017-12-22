<template>
  <modal
    name="leaseModal"
    height="auto"
    :adaptive="true"
    @before-open="beforeOpen"
    @closed="closed">
    <div v-if="!txWait" class="buy-modal">
      <div v-if="card" class="ui container center aligned">
        <h2 class="ui header">
          <i class="fa fa-key"></i>
          Lease
          <router-link target="_blank" :to="{ name: 'CardDetails', params: { id: card.id } }"
            :data-tooltip="`View card #${card.id} details`" data-inverted="" data-position="right center">
            #{{ card.id }}
          </router-link>
        </h2>
      </div>
      <div v-if="card" class="ui container">
        <!-- Lease details -->
        <div class="ui segment basic grid equal width center aligned">
          <div class="column">
            <h3 class="ui header">Ξ Total Amount</h3>
            <b>{{ price }}</b> Ether
          </div>
          <div class="column">
            <h3 class="ui header"><i class="far fa-clock"></i> Duration</h3>
            <b>{{ parseInt(card.leaseDuration).toLocaleString() }}</b> blocks<br />
            {{ card.estimatedLeaseEnd().fromNow() }}
            <span :data-tooltip="`Based on a 15 sec average block time : ${card.estimatedLeaseEnd().format('LL')}`" data-inverted="">
            <i class="fa fa-question-circle"></i>
            </span>
          </div>
          <div v-if="card" class="column" style="word-wrap: break-word;">
            <h3 class="ui header"><i class="far fa-user"></i>Lessor</h3>
            <b>{{ card.owner }}</b>
          </div>
        </div>
        <!-- Warning -->
        <div class="ui yellow message">
          Details cannot be updated afterwards, please <b>double-check fields</b> before submitting !
        </div>
        <!-- Lease form -->
        <form class="ui form" @submit.prevent="lease()">
          <div class="field">
            <label>Title</label>
            <div class="ui labeled input">
              <div class="ui label">
                <i class="fa fa-bars"></i>
              </div>
              <input type="text" v-model="leaseForm.title" name="title" placeholder="Enter title">
            </div>
          </div>
          <div class="field">
            <label>URL</label>
            <div class="ui labeled input">
              <div class="ui label">
                <i class="fa fa-link"></i>
              </div>
              <input type="url" v-model="leaseForm.url" name="url" placeholder="http://">
            </div>
          </div>
          <div class="field">
            <label>Image</label>
            <div class="ui labeled input">
              <div class="ui label">
                <i class="far fa-image"></i>
              </div>
              <input type="url" v-model="leaseForm.image" name="image" placeholder="Enter image URL">
            </div>
          </div>
          <!-- Card preview -->
          <div v-if="preview" class="field">
            <div class="ui cards link">
              <div class="ui centered card raised">
                <div class="ui fluid image">
                  <img class="ui image" :src="previewImage">
                </div>
                <div class="content">
                  <div class="ui header">{{ leaseForm.title }}</div>
                  <div class="meta">
                    {{ leaseForm.url }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Actions -->
          <div class="ui segment basic center aligned">
            <button class="ui green button"
                    :class="{ 'disabled': !formValid }"
                    type="submit">
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
import Card from '@/api/Card'
import { successNotification, transactionDeniedNotif } from '@/api'

var defaultForm = {
  title: null,
  url: null,
  image: null
}

export default {
  name: 'leaseModal',
  components: {
    TxLoader
  },
  data () {
    return {
      card: null,
      leaseForm: defaultForm,
      txWait: false
    }
  },
  computed: {
    preview () {
      return (this.leaseForm.title != null || this.leaseForm.url != null || this.leaseForm.image != null)
    },
    price () {
      if (this.card) return this.card.getLeaseTotalAmount()
    },
    previewImage () {
      return ((this.leaseForm.image || '') === '') ? require('@/assets/images/card-placeholder.png') : this.leaseForm.image
    },
    formValid () {
      return ((this.leaseForm.title || '') !== '' && (this.leaseForm.url || '') !== '' && (this.leaseForm.image || '') && // fields are not null and not empty
                (this.leaseForm.title.length >= 3 && this.leaseForm.title.length <= 38))
    }
  },
  methods: {
    lease () {
      if (!this.formValid) return false
      const card = Card.getById(this.card.id)
      this.txWait = true
      card.lease({
        title: this.leaseForm.title,
        url: this.leaseForm.url,
        image: this.leaseForm.image
      })
        .then((txHash) => {
          this.txWait = false
          successNotification(`<b>Card #${card.id}</b> leased until ${this.card.estimatedLeaseEnd().format('LL')} !`)
          this.closeModal()
        })
        .catch((err) => {
          console.log(err.message)
          transactionDeniedNotif(err.message)
          this.txWait = false
        })
    },
    closeModal () {
      this.$modal.hide('leaseModal')
    },
    beforeOpen (event) {
      if (event.params === undefined) return false
      this.card = event.params.card
    },
    closed (event) {
      this.txWait = false
      this.leaseForm = {
        title: null,
        url: null,
        image: null
      }
    }
  }
}
</script>
<style scoped>
.buy-modal {
  padding: 1.5em;
}
.image {
  max-height: 93px !important;
}
.header {
  margin-bottom: 0.1em !important;
}
</style>
