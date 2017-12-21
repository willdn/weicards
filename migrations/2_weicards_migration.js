const ETHCards = artifacts.require("./WeiCards.sol");

module.exports = function(deployer, network, accounts) {
  console.log("Deploying to: ", network, accounts)
  // We deploy the contract with the owner being the first address from accounts
  const owner = accounts[0]
  if (network == "live") {
    deployer.deploy(ETHCards, owner)
    return
  }
  deployer.deploy(ETHCards, owner, {
    gasPrice: 18
  })
}