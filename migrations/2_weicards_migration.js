const ETHCards = artifacts.require("./WeiCards.sol");

module.exports = function(deployer, network, accounts) {
  console.log("Deploying to: ", network, accounts)
  // We deploy the contract with the owner being the first address from accounts
  //const owner = accounts[0]
  const owner = '0xd90884c83AaB1EdFa43806e059A8735D5D75c574'
  if (network == "live") {
    const withdrawWallet = ""
    deployer.deploy(ETHCards, owner)
    return
  }
  deployer.deploy(ETHCards, owner, {
    gasPrice: 11
  })
}