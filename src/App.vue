<template>
  <div id="app">
    <navbar />
    <router-view id="app-content" />
    <footer-component />
    <!-- Modals -->
    <!-- <unknown-network-modal></unknown-network-modal> -->
    <set-lease-offer-modal></set-lease-offer-modal>
    <buy-modal></buy-modal>
    <sell-card-modal></sell-card-modal>
    <cancel-sell-offer-modal></cancel-sell-offer-modal>
    <cancel-lease-offer-modal></cancel-lease-offer-modal>
    <lease-modal></lease-modal>
  </div>
</template>

<script>
import "@/assets/css/semantic.simplex.css";
import "@/assets/css/style.css";
import "../node_modules/izitoast/dist/css/iziToast.min.css";

import Navbar from "@/components/Navbar";
import FooterComponent from "@/components/FooterComponent";
// Modals
import UnknownNetworkModal from "@/components/modals/UnknownNetworkModal";
import SetLeaseOfferModal from "@/components/modals/SetLeaseOfferModal";
import BuyModal from "@/components/modals/BuyModal";
import SellCardModal from "@/components/modals/SellCardModal";
import CancelSellOfferModal from "@/components/modals/CancelSellOfferModal";
import CancelLeaseOfferModal from "@/components/modals/CancelLeaseOfferModal";
import LeaseModal from "@/components/modals/LeaseModal";

import JSONInterface from "../static/contracts/WeiCards.json";
import config from "./config";
import Card from "./api/Card";
import Web3 from "web3";

const networkConfig = {
  live: {
    networkId: 1,
    contractAddress: config.contractAddressMain,
    fallback: `https://mainnet.infura.io/${config.infuraAPIKey}`,
  },
  ropsten: {
    networkId: 3,
    contractAddress: config.contractAddressRopsten,
    fallback: `https://ropsten.infura.io/${config.infuraAPIKey}`,
  },
  dev: {
    contractAddress: config.contractAddressDev,
    fallback: "http://localhost:9545",
  },
};

export default {
  name: "app",
  components: {
    Navbar,
    FooterComponent,
    UnknownNetworkModal,
    SetLeaseOfferModal,
    BuyModal,
    SellCardModal,
    CancelSellOfferModal,
    CancelLeaseOfferModal,
    LeaseModal,
  },
  data() {
    return {
      network: "live",
      contract: null,
    };
  },
  watch: {
    networkUnknown(value) {
      // if (value) this.$modal.show('unknownNetworkModal')
    },
  },
  computed: {
    isReadOnly() {
      return (
        !web3.currentProvider.isMetaMask || !this.$store.getters.currentAddress
      );
    },
    networkUnknown() {
      return this.$store.getters.networkUnknown;
    },
  },
  methods: {
    /*
    switchNetwork () {
      let network
      if (this.network === 'dev') network = 'ropsten'
      else network = 'dev'
      this.network = network

      window.web3 = new Web3(new Web3.providers.HttpProvider(networkConfig[network].fallback))
      const contract = this.getContract()
      this.contract = contract
      this.$store.dispatch('setContract', contract)
      this.$store.dispatch('clearCards')
      this.getCurrentAddress()
        .then(() => {
          this.buildCards()
          return true
        })
    },
    */
    connectWallet: async (_event) => {
      const [selectedAddress] = await window.ethereum.enable();
      this.$store.dispatch("setCurrentAddress", selectedAddress);
    },
    setWeb3() {
      if (typeof web3 !== "undefined") {
        console.log("Web3 injected browser: OK.");
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        console.log("Web3 injected browser: Fail. Fallback to INFURA.");
        window.web3 = new Web3(
          new Web3.providers.HttpProvider(networkConfig[this.network].fallback)
        );
      }
      return window.web3;
    },
    getContract() {
      const AppContract = new window.web3.eth.Contract(
        JSONInterface.abi,
        networkConfig[this.network].contractAddress
      );
      const contract = Object.freeze(AppContract);
      this.$store.dispatch("setContract", contract);
      this.contract = contract;
      return contract;
    },
    getCurrentAddress() {
      return window.web3.eth.getAccounts().then((addresses) => {
        const address = addresses[0];
        if (this.$store.getters.currentAddress !== address) {
          this.$store.dispatch("setCurrentAddress", address);
        }
        return address;
      });
    },
    getLastLease(id) {
      return this.contract.methods
        .getLastLease(id)
        .call()
        .then((lastLease) => {
          let _card = Card.getById(id);
          if (lastLease[0] !== "0") {
            _card.lastLease = lastLease;
          }
          return lastLease;
        });
    },
    buildCards() {
      for (let i = 1; i <= config.cardsNumber; i++) {
        this.contract.methods
          .getCard(i)
          .call()
          .then((card) => {
            return this.contract.methods
              .getCardDetails(i)
              .call()
              .then((details) => {
                this.$store.dispatch(
                  "addCard",
                  new Card({
                    id: i,
                    owner: card.owner,
                    title: card.title,
                    url: card.url,
                    image: card.image,
                    price: details.price,
                    priceLease: details.priceLease,
                    leaseDuration: details.leaseDuration,
                    availableBuy: details.availableBuy,
                    availableLease: details.availableLease,
                  })
                );
                return this.getLastLease(i);
              });
          })
          .catch((err) => {
            // Most certainly because on wrong network
            this.$store.dispatch("setNetworkUnknown", true);
            console.log(err.message);
            return err;
          });
      }
      return true;
    },
    getBlockNumber() {
      /* global web3 */
      return web3.eth.getBlockNumber().then((blockNumber) => {
        if (this.$store.getters.blockNumber !== blockNumber) {
          this.$store.dispatch("setBlockNumber", blockNumber);
        }
        return blockNumber;
      });
    },
  },
  mounted() {
    this.setWeb3();
    this.getContract();
    this.getCurrentAddress()
      .then((address) => {
        // Get block number
        return this.getBlockNumber();
      })
      .then((blockNumber) => {
        // Building cards
        return this.buildCards();
      })
      .then(() => {
        setInterval(() => {
          // Start MetaMask polling
          this.getCurrentAddress();
          // Block number polling
          this.getBlockNumber();
        }, 5000);
        return true;
      });
  },
};
</script>

<style>
</style>
