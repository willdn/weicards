const state = {
  contract: null,
  wrappedContract: null,
  currentAddress: null,
  cards: [],
  blockNumber: 0,
  networkUnknown: false
}

// getters
const getters = {
  app: state => state,
  contract: state => state.contract,
  wrappedContract: state => state.wrappedContract,
  currentAddress: state => state.currentAddress,
  cards: state => state.cards,
  blockNumber: state => state.blockNumber,
  networkUnknown: state => state.networkUnknown
}

// actions
const actions = {
  setContract ({ commit, state }, contract) {
    commit('setContract', contract)
  },
  setWrappedContract ({ commit, state }, wrappedContract) {
    commit('setWrappedContract', wrappedContract)
  },
  setCurrentAddress ({ commit, state }, currentAddress) {
    commit('setCurrentAddress', currentAddress)
  },
  addCard ({ commit, state }, card) {
    commit('addCard', card)
  },
  clearCards ({ commit, state }) {
    commit('clearCards')
  },
  setBlockNumber ({ commit, state }, blockNumber) {
    commit('setBlockNumber', blockNumber)
  },
  setNetworkUnknown ({ commit, state }, status) {
    commit('setNetworkUnknown', status)
  }
}

// mutations
const mutations = {
  setContract (state, contract) {
    state.contract = contract
  },
  setWrappedContract (state, contract) {
    state.wrappedContract = contract
  },
  setCurrentAddress (state, currentAddress) {
    state.currentAddress = currentAddress
  },
  addCard (state, card) {
    state.cards.push(card)
  },
  setBlockNumber (state, blockNumber) {
    state.blockNumber = parseInt(blockNumber)
  },
  clearCards (state) {
    state.cards = []
  },
  setNetworkUnknown (state, status) {
    state.networkUnknown = status
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
