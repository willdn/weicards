var ganache = require("ganache-cli");
var HDWalletProvider = require("truffle-hdwallet-provider");
var dotenv = require('dotenv').config()

var infura_apikey = "ZAG8Wc8qPxdO3cfopRgd";
var mnemonic = dotenv.parsed.PASSPHRASE;

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*" // Match any network id
    },
    test: {
      provider: ganache.provider(), // in-memory TestRPC provider
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + infura_apikey, 2),
      network_id: 3,
      gas: 4700000
      //gas: 5000000,
    }
  }
};
