<template>
  <div v-if="card" class="ui card raised" :class="{ 'orange': inLeasing }">
    <div class="ui fluid image">
      <!-- Card id + yellow if is owner -->
      <router-link :to="{ name: 'CardDetails', params: { 'id': card.id }}">
        <div class="ui floating right circular label card-id-label" :class="{ 'teal': isOwner }"
            :data-tooltip="`View card #${card.id} details`" data-inverted="">
            <b>{{ card.id }}</b>
        </div>
      </router-link>
      <!-- Card Image -->
      <img @click.prevent="cardClick()" class="ui image" :src="imageURL"
           @error="imageFallback">
      <!-- Ribbon available buy -->
      <a v-if="card.availableBuy" class="ui green tiny left ribbon label"
         @click.prevent="buyCard()">
        <i class="fa fa-shopping-cart"></i>
        <b>Buy</b>
      </a>
      <!-- Ribbon available lease -->
      <a v-if="card.availableLease" class="ui orange tiny left ribbon label"
         @click.prevent="leaseCard()">
        <i class="fa fa-key"></i>
        <b>Lease</b>
      </a>
    </div>
    <!-- Card title/URL -->
    <div class="content" @click.prevent="cardClick()">
      <div class="ui header" :class="{ 'available' : !card.isBought() }">
        {{ card.getTitle() }}
      </div>
      <div v-if="card.isBought()" class="meta">
        {{ card.getURL() }}
      </div>
    </div>
    <!-- User Buy -->
    <div v-if="card.availableBuy && !card.owner.startsWith('0x0') && card.owner !== currentAddress" class="extra content">
      <div class="ui grid equal width center aligned"
           :data-tooltip="`Buy card #${card.id} at ${card.computeInitialPrice().toLocaleString()} Ξ from ${card.owner.substring(0,15)}...`" data-inverted="">
        <div class="column green-hover" @click.prevent="buyCard()">
          <i class="fa fa-shopping-cart"></i>
          Buy (<b>{{ card.buyPriceToEther() }} Ξ</b>)
        </div>
      </div>
    </div>
    <!-- Owner infos -->
    <div v-if="!card.availableBuy && card.owner !== currentAddress && !card.availableLease && !inLeasing" class="extra content">
      <div class="ui grid equal width center aligned">
        <div class="column"
             :data-tooltip="`Owned by ${card.owner}`" data-inverted="">
          <i class="fa fa-user"></i>
          {{ card.owner.substring(0, 12) }}...
        </div>
      </div>
    </div>
    <!-- Leasing : Tenants infos -->
    <div v-if="!card.availableBuy && card.owner !== currentAddress && inLeasing" class="extra content">
      <div class="ui grid equal width center aligned">
        <div class="column"
             :data-tooltip="`Leased by ${card.lastLease.tenant.substring(0, 12)}... until ${card.endLeaseDate().format('LL')}`" data-inverted="">
          <i class="fa fa-key"></i>
          {{ card.lastLease.tenant.substring(0, 12) }}...
        </div>
      </div>
    </div>
    <!-- Card owner settings -->
    <div v-if="isOwner" class="extra content">
      <div class="ui grid equal width center aligned">
        <!-- Sell -->
        <div class="column green-hover" v-if="!card.availableBuy && !card.availableLease && !card.inLeasing()"
             :data-tooltip="`Sell card #${card.id}`" data-inverted=""
             @click.prevent="sellCard()">
          <i class="fa fa-dollar-sign"></i>
          Sell
        </div>
        <!-- Cancel sale -->
        <div class="column red-hover" v-if="card.availableBuy"
             :data-tooltip="`Cancel card #${card.id} sale`" data-inverted=""
             @click.prevent="cancelSellCard()">
          <i class="fa fa-times"></i>
          Cancel sale (<b>{{ card.buyPriceToEther() }} Ξ</b>)
        </div>
        <!-- Lease -->
        <!-- Set Lease -->
        <div class="column orange-hover" v-if="!card.availableBuy && !card.availableLease && !card.inLeasing()"
             :data-tooltip="`Rent out card #${card.id}`" data-inverted=""
             @click.prevent="setLeaseCard()">
          <i class="fa fa-key"></i>
           Rent out
        </div>
        <!-- Cancel lease -->
        <div class="column red-hover" v-if="card.availableLease"
             :data-tooltip="`Cancel card #${card.id} rent out (${leaseTotalAmount} Ξ / ${card.leaseDuration.toLocaleString()} blocks)`" data-inverted=""
             @click.prevent="cancelLeaseOffer()">
          <i class="fa fa-times"></i>
           Cancel rent out
        </div>
        <!-- Leasing -->
        <div class="column" v-if="card.inLeasing()"
             :data-tooltip="`Your card #${card.id} is in lease until ${card.endLeaseDate().format('LL')}`" data-inverted="">
          <i class="fa fa-key"></i>
           Leasing to {{ card.lastLease.tenant.substring(0, 15) }}
        </div>
      </div>
    </div>
    <!-- Initial Buy -->
    <div v-if="!card.isBought()" class="extra content">
      <div class="ui grid equal width center aligned">
        <div class="column green-hover" @click.prevent="buyCard()"
             :data-tooltip="`Buy card #${card.id} at ${card.computeInitialPrice().toLocaleString()} Ξ`" data-inverted="">
          <i class="fa fa-shopping-cart"></i>
          Buy (<b>{{ card.computeInitialPrice().toLocaleString() }} Ξ</b>)
        </div>
      </div>
    </div>
    <!-- Lease available -->
    <div v-if="card.availableLease && card.owner != currentAddress" class="extra content">
      <div class="ui grid equal width center aligned">
        <div class="column green-hover" @click.prevent="leaseCard()"
             :data-tooltip="`Lease card #${card.id} at ${leaseTotalAmount} Ξ until ${card.estimatedLeaseEnd().format('LL')}`" data-inverted="">
          <i class="fa fa-key"></i>
          <b>{{ leaseTotalAmount }} Ξ</b> / {{ parseInt(card.leaseDuration).toLocaleString() }} blocks
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from '@/api/Card'
import * as api from '@/api'

export default {
  name: 'card',
  props: ['index'],
  data () {
    return {
      card: null,
      imageURL: null
    }
  },
  computed: {
    currentAddress () {
      return this.$store.getters.currentAddress
    },
    leaseTotalAmount () {
      return this.card.getLeaseTotalAmount()
    },
    inLeasing () {
      return this.card.inLeasing()
    },
    isOwner () {
      return (this.card.owner === this.currentAddress)
    }
  },
  methods: {
    imageFallback () {
      this.imageURL = require('@/assets/images/card-placeholder.png')
    },
    buyCard () {
      if (this.isOwner) {
        api.errorNotification('You cannot buy your own card !')
        return false
      }
      this.$modal.show('buyModal', {
        card: this.card
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
    leaseCard () {
      if (this.isOwner) {
        api.errorNotification('You cannot lease your own card !')
        return false
      }
      this.$modal.show('leaseModal', {
        card: this.card
      })
    },
    cardClick () {
      if (this.card.availableBuy && !this.card.isBought()) {
        return this.buyCard()
      } else {
        window.open(this.card.getURL(), '_blank')
      }
    }
  },
  mounted () {
    this.card = Card.getById(this.index)
    this.imageURL = this.card.getImageURL()
  }
}
</script>

<style scoped>
.header.available {
  color: rgba(0, 0, 0,.6) !important;
}
.header {
  margin-bottom: 0.1em !important;
}
.image {
  max-height: 93px !important;
}
.card-id-label {
  color: rgba(255, 255, 255, 0.95);
  background-color: #F8C75B;
}
.green-hover:hover {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
  background-color: rgba(33, 186, 69, 0.2) ;
}
.red-hover:hover {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
  background-color: rgba(219, 40, 40, 0.2);
}
.orange-hover:hover {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
  background-color: rgba(242, 113, 28, 0.2);
}
</style>
