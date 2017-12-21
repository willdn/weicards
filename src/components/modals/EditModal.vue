<template>
  <modal
    name="editModal"
    height="auto"
    :adaptive="true"
    @before-open="beforeOpen"
    @closed="closed">
    <div v-if="!txWait" class="edit-modal">
      <div v-if="card" class="ui container center aligned">
        <h2 class="ui header">
          <i class="fa fa-wrench"></i>
          Edit #{{ card.id }}
        </h2>
      </div>
      <div class="ui container">
        <form class="ui form" @submit.prevent="edit()">
          <div class="field">
            <label>Title</label>
            <div class="ui labeled input">
              <div class="ui label">
                <i class="fa fa-bars"></i>
              </div>
              <input type="text" v-model="editForm.title" name="title" placeholder="Enter title">
            </div>
          </div>
          <div class="field">
            <label>URL</label>
            <div class="ui labeled input">
              <div class="ui label">
                <i class="fa fa-link"></i>
              </div>
              <input type="url" v-model="editForm.url" name="url" placeholder="http://">
            </div>
          </div>
          <div class="field">
            <label>Image</label>
            <div class="ui labeled input">
              <div class="ui label">
                <i class="far fa-image"></i>
              </div>
              <input type="url" v-model="editForm.image" name="image" placeholder="Enter image URL">
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
                  <div class="ui header">{{ editForm.title }}</div>
                  <div class="meta">
                    {{ editForm.url }}
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
import { transactionDeniedNotif, successNotification } from '@/api'

export default {
  name: 'editModal',
  components: {
    TxLoader
  },
  data () {
    return {
      card: null,
      editForm: {
        title: null,
        url: null,
        image: null
      },
      txWait: false
    }
  },
  computed: {
    preview () {
      return (this.editForm.title != null || this.editForm.url != null || this.editForm.image != null)
    },
    previewImage () {
      return ((this.editForm.image || '') === '') ? require('@/assets/images/card-placeholder.png') : this.editForm.image
    },
    formValid () {
      return ((this.editForm.title || '') !== '' && (this.editForm.url || '') !== '' && (this.editForm.image || '') && // fields are not null and not empty
                (this.editForm.title.length >= 3 && this.editForm.title.length <= 38))
    }
  },
  methods: {
    edit () {
      if (!this.formValid) return false
      this.txWait = true
      const card = Card.getById(this.card.id)

      card.edit({
        title: this.editForm.title,
        url: this.editForm.url,
        image: this.editForm.image
      })
        .then((txHash) => {
          this.txWait = false
          successNotification(`<b>Card #${card.id}</b> edited !`)
          this.closeModal()
        })
        .catch((err) => {
          console.log(err.message)
          transactionDeniedNotif(err.message)
          this.txWait = false
        })
    },
    closeModal () {
      this.$modal.hide('editModal')
    },
    beforeOpen (event) {
      if (event.params === undefined) return false
      this.card = event.params.card
      this.editForm.title = this.card.title
      this.editForm.url = this.card.url
      this.editForm.image = this.card.image
    },
    closed (event) {
      this.txWait = false
      this.editForm = {
        title: null,
        url: null,
        image: null
      }
    }
  }
}
</script>
<style scoped>
.edit-modal {
  padding: 1.5em;
}
.image {
  max-height: 93px !important;
}
.header {
  margin-bottom: 0.1em !important;
}
</style>
