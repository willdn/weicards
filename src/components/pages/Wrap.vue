<template>
  <div class="ui container">
    <div class="ui basic segment fluid">
      <h1 class="ui header">
        Wrap weicard
      </h1>
    </div>

    <div class="ui segment raised">
      <div class="ui link selection animated list">
          <form class="ui form">
            <h3>Make sure to confirm all 3 transactions!</h3>
            <h3>Do not leave the page until all 3 transactions are confirmed!</h3>
            <h3>You can only wrap your card if:</h3>
            <ul>
              <li>you own the card,</li>
              <li>the card is not wrapped yet,</li>
              <li>the card is not offered for buying or renting,</li>
              <li>the card is not rented out.</li>
            </ul>
            <h3>Use at your own risk!</h3>
            <div class="field">
              <label>Card id</label>
              <div class="ui right labeled input">
                <div class="ui label">
                  #
                </div>
                <input type="text" v-model="cardId" name="card" placeholder="Enter card id"
                      autocomplete="off">
                <div class="ui label">
              </div>
            </div>
            <!-- Actions -->
            <div class="ui segment basic center aligned">
              <button class="ui green button"
                :class="{ 'disabled': !formValid() }"
                @click.prevent="wrapCard()">
                Wrap
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'wrap',
  components: {
  },
  data () {
    return {
      cardId: null,
      success: false
    }
  },
  computed: {
    cards () {
      return this.$store.getters.cards
    }
  },
  methods: {
    wrapCard () {
      this.$modal.show('wrapModal', {
        card: this.getCard()
      })
    },
    getCard () {
      return this.cards.find(c => {
        return c.id === parseInt(this.cardId)
      })
    },
    formValid () {
      const card = this.getCard()
      return card && !card.availableBuy && !card.availableLease && !card.inLeasing()
    },
    setSuccess () {
      this.success = true
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
.container {
  max-width: 978px !important;
}
h2 {
  margin-bottom: 1em !important;
  margin-top: 1em !important;
}
h3 {
  margin-bottom: 1em !important;
  margin-top: 1em !important;
}
.card-description {
  margin-top: 0em;
  font-style: italic;
}
.card {
  max-width: 250px !important;
}
.card-image {
  max-height: 100px !important;
}
.ui.cards > .card > .content > .header, .ui.card > .content > .header {
  margin-bottom: 0.1em;
}
.buy-list {
  margin-left: 0.5em;
  color: rgba(0,0,0,.70) !important;
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
