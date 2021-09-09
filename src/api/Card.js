
import store from '../store'
import BigNumber from 'bignumber.js'
import web3 from 'web3'
import moment from 'moment'
import app from '../App'

class Card {
  constructor (data) {
    this.id = data.id
    this.owner = data.owner
    this.wrappedOwner = data.wrappedOwner
    this.title = data.title
    this.url = data.url
    this.image = data.image
    this.price = data.price
    this.priceLease = data.priceLease
    this.leaseDuration = data.leaseDuration
    this.availableBuy = data.availableBuy
    this.availableLease = data.availableLease
    this.lastLease = data.lastLease
    this.wrapStatus = null
  }

  static getById (id) {
    return store.getters.cards.find(c => c.id === id)
  }

  isBought () {
    return (!this.owner.startsWith('0x0000000000000000000000000000000000000000'))
  }

  getTitle () {
    if (this.isBought() && !this.inLeasing()) {
      return this.title
    } else if (this.isBought() && this.inLeasing()) {
      return this.lastLease.title
    }
    return `Card #${this.id}`
  }

  getURL () {
    if (this.isBought() && !this.inLeasing()) {
      return this.url
    } else if (this.isBought() && this.inLeasing()) {
      return this.lastLease.url
    }
    return ''
  }

  getImageURL () {
    if (this.isBought() && !this.inLeasing()) {
      return this.image
    } else if (this.isBought() && this.inLeasing()) {
      return this.lastLease.image
    }
    return require('@/assets/images/card-placeholder.png')
  }

  getOwner () {
    return (this.isBought()) ? this.owner : ''
  }

  isOwner () {
    return (store.getters.currentAddress === this.owner)
  }

  isWrappedOwner () {
    return (store.getters.currentAddress === this.wrappedOwner)
  }

  computeInitialPrice () {
    return 1 - (0.01 * (this.id - 1))
  }

  computeInitialPriceWei () {
    return web3.utils.toWei(this.computeInitialPrice(), 'ether')
  }

  buy (initialBuy, data) {
    if (initialBuy) {
      return this.initialBuy(data)
    } else {
      return this.userBuy(data)
    }
  }

  initialBuy (data) {
    return store.getters.contract.methods.initialBuyCard(
      this.id,
      data.title,
      data.url,
      data.image
      )
      .send({ from: store.getters.currentAddress, value: data.price })
      .then((txHash) => {
        this.owner = store.getters.currentAddress
        this.title = data.title
        this.url = data.url
        this.image = data.image
        this.availableBuy = false
        return txHash
      })
  }

  userBuy (data) {
    return store.getters.contract.methods.buyCard(
      this.id,
      data.title,
      data.url,
      data.image
      )
      .send({ from: store.getters.currentAddress, value: data.price })
      .then((txHash) => {
        this.owner = store.getters.currentAddress
        this.title = data.title
        this.url = data.url
        this.image = data.image
        this.availableBuy = false
        return txHash
      })
  }

  setSell (amount) {
    return store.getters.contract.methods.sellCard(this.id, amount)
      .send({ from: store.getters.currentAddress })
      .then((txHash) => {
        this.availableBuy = true
        this.price = amount
        return txHash
      })
  }

  cancelSellOffer () {
    return store.getters.contract.methods.cancelSellCard(this.id)
      .send({ from: store.getters.currentAddress })
      .then((txHash) => {
        this.availableBuy = false
        return txHash
      })
  }

  setLeaseOffer (pricePerBlock, leaseDuration) {
    return store.getters.contract.methods.setLeaseCard(this.id, pricePerBlock, leaseDuration)
      .send({ from: store.getters.currentAddress })
      .then((txHash) => {
        this.priceLease = pricePerBlock
        this.leaseDuration = leaseDuration
        this.availableLease = true
        return txHash
      })
  }

  cancelLeaseOffer () {
    return store.getters.contract.methods.cancelLeaseOffer(this.id)
      .send({ from: store.getters.currentAddress })
      .then((txHash) => {
        this.availableLease = false
        return txHash
      })
  }

  getLeaseTotalAmount () {
    let price = this.priceLease * this.leaseDuration
    return web3.utils.fromWei(new BigNumber(price).toNumber().toString(), 'ether')
  }

  getLeaseTotalAmountWei () {
    const priceLease = new BigNumber(this.priceLease)
    const leaseDuration = new BigNumber(this.leaseDuration)
    return priceLease.times(leaseDuration)
  }

  lease (data) {
    const amount = this.getLeaseTotalAmountWei()
    return store.getters.contract.methods.leaseCard(this.id,
      data.title,
      data.url,
      data.image)
      .send({ from: store.getters.currentAddress, value: amount })
      .then((txHash) => {
        // TODO: Must get block number and add this.card.leaseDuration
        /*
        this.availableLease = false
        this.lastLease = {
          title: data.title,
          image: data.image,
          url: data.url,
          tenant: store.getters.currentAddress
          // untilBlock:"3286048"
        }
        */
        return txHash
      })
  }

  inLeasing () {
    let blockNumber = store.getters.blockNumber
    return (this.lastLease && this.lastLease.untilBlock >= blockNumber)
  }

  transferOwnership (to) {
    return store.getters.contract.methods.transferCardOwnership(to, this.id)
      .send({ from: store.getters.currentAddress })
      .then((txHash) => {
        this.leaseDuration = to
        return txHash
      })
  }

  claim () {
    return store.getters.wrappedContract.methods.claimCard(this.id)
      .send({ from: store.getters.currentAddress })
      .then((txHash) => {
        return txHash
      })
  }

  wrap () {
    return store.getters.wrappedContract.methods.wrap(this.id)
      .send({ from: store.getters.currentAddress })
      .then((txHash) => {
        return txHash
      })
  }

  edit (data) {
    if (this.isWrapped) {
      return store.getters.wrappedContract.methods.editCard(this.id,
        data.title,
        data.url,
        data.image)
        .send({ from: store.getters.currentAddress })
        .then((txHash) => {
          this.title = data.title
          this.url = data.url
          this.image = data.image
          return txHash
        })
    }
    return store.getters.contract.methods.editCard(this.id,
      data.title,
      data.url,
      data.image)
      .send({ from: store.getters.currentAddress })
      .then((txHash) => {
        this.title = data.title
        this.url = data.url
        this.image = data.image
        return txHash
      })
  }

  buyPriceToEther () {
    return web3.utils.fromWei(this.price, 'ether')
  }

  estimatedLeaseEnd () {
    const blockTime = 15
    let totalTimeSecond = this.leaseDuration * blockTime
    return moment().add(totalTimeSecond, 's')
  }

  endLeaseDate () {
    if (this.inLeasing()) {
      const blockTime = 15
      let blockNumber = store.getters.blockNumber
      let totalTimeSecond = (this.lastLease.untilBlock - blockNumber) * blockTime
      return moment().add(totalTimeSecond, 's')
    }
  }

  isWrapped () {
    return this.owner === app.currentNetworkConfig.wrapContractAddress
  }
}

export default Card
