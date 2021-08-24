<template>
  <modal
    name="buyModal"
    height="auto"
    :adaptive="true"
    @before-open="beforeOpen"
    @closed="closed">
    <div v-if="!txWait" class="buy-modal">
      <!-- Header -->
      <div v-if="card" class="ui container center aligned">
        <h2 class="ui header">
          <i class="fa fa-shopping-cart"></i>
          Buy
          <router-link target="_blank" :to="{ name: 'CardDetails', params: { id: card.id } }"
            :data-tooltip="`View card #${card.id} details`" data-inverted="" data-position="right center">
            #{{ card.id }}
          </router-link>
        </h2>
      </div>
      <div class="ui container">
        <div class="ui segment basic grid equal width center aligned">
          <div class="column">
            <h3 class="ui header">Ξ Amount</h3>
            <b>{{ price }}</b> Ether
          </div>
          <div v-if="card && !isInitialBuy" class="column">
            <h3 class="ui header"><i class="far fa-user"></i>Owner</h3>
            <b>{{ card.owner.substring(0, 15) }}...</b>
          </div>
        </div>
        <form class="ui form" @submit.prevent="buy()">
          <div class="field">
            <label>Title</label>
            <div class="ui labeled input">
              <div class="ui label">
                <i class="fa fa-bars"></i>
              </div>
              <input type="text" v-model="buyForm.title" name="title" placeholder="Enter title">
            </div>
          </div>
          <div class="field">
            <label>URL</label>
            <div class="ui labeled input">
              <div class="ui label">
                <i class="fa fa-link"></i>
              </div>
              <input type="url" v-model="buyForm.url" name="url" placeholder="http://">
            </div>
          </div>
          <div class="field">
            <label>Image</label>
            <div class="ui labeled input">
              <div class="ui label">
                <i class="far fa-image"></i>
              </div>
              <input type="url" v-model="buyForm.image" name="image" placeholder="Enter image URL">
            </div>
          </div>
          <!-- Card preview -->
          <div v-if="preview" class="field">
            <label>Preview</label>
            <div class="ui cards link">
              <div class="ui centered card raised">
                <div class="ui fluid image">
                  <img class="ui image" :src="previewImage">
                </div>
                <div class="content">
                  <div class="ui header">{{ buyForm.title }}</div>
                  <div class="meta">
                    {{ buyForm.url }}
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
import BigNumber from 'bignumber.js'
import TxLoader from '@/components/layouts/TxLoader'
import Card from '@/api/Card'
import { transactionDeniedNotif, errorNotification, successNotification } from '@/api'

var defaultForm = {
  title: null,
  url: null,
  image: null
}

export default {
  name: 'buyModal',
  components: {
    TxLoader
  },
  data () {
    return {
      card: null,
      buyForm: defaultForm,
      txWait: false
    }
  },
  computed: {
    preview () {
      return (this.buyForm.title != null || this.buyForm.url != null || this.buyForm.image != null)
    },
    isInitialBuy () {
      if (!this.card) return null
      return (this.card.owner.startsWith('0x0000000000000000000000000000000000000000'))
    },
    price () {
      if (!this.card) return null
      if (this.isInitialBuy) {
        return this.card.computeInitialPrice().toFixed(2)
      } else {
        /* globals web3 */
        return web3.utils.fromWei(this.card.price, 'ether')
      }
    },
    previewImage () {
      return ((this.buyForm.image || '') === '') ? require('@/assets/images/card-placeholder.png') : this.buyForm.image
    },
    formValid () {
      return ((this.buyForm.title || '') !== '' && (this.buyForm.url || '') !== '' && (this.buyForm.image || '') && // fields are not null and not empty
                (this.buyForm.title.length >= 3 && this.buyForm.title.length <= 38))
    }
  },
  methods: {
    buy () {
      if (!this.formValid) return false
      this.txWait = true
      const card = Card.getById(this.card.id)
      /* globals web3 */
      const price = web3.utils.toWei(new BigNumber(this.price).toNumber().toString(), 'ether')
      card.buy(this.isInitialBuy, {
        title: this.buyForm.title,
        url: this.buyForm.url,
        image: this.buyForm.image,
        price: price
      })
        .then((txHash) => {
          this.txWait = false
          successNotification(`<b>Card #${card.id}</b> bought !`)
          this.closeModal()
        })
        .catch((err) => {
          console.log(err.message)
          if (err.message.includes('No "from" address specified in neither the given options')) {
            errorNotification(`You should use <b>MetaMask</b> in order to buy this card.`)
          } else {
            transactionDeniedNotif(err.message)
          }
          this.txWait = false
        })
    },
    closeModal () {
      this.$modal.hide('buyModal')
    },
    beforeOpen (event) {
      if (event.params === undefined) return false
      this.card = event.params.card
    },
    closed (event) {
      this.txWait = false
      this.buyForm = {
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
