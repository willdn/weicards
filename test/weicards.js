const ETHCards = artifacts.require('./WeiCards.sol')

contract('WeiCards', (accounts) => {
  const owner = accounts[0]
  const withdrawWallet = accounts[1]
  const account1 = accounts[2]
  const account2 = accounts[3]
  const giveETH = '0x5ADF43DD006c6C36506e2b2DFA352E60002d22Dc'

  it('should fail when buying a non yet sold card', function() {
    let APP
    return ETHCards.new(owner)
      .then(function(instance) {
        APP = instance
        return APP.buyCard(5, 'test1', 'url', 'imgurl', {from: account1, value: 960000000000000000})
      })
      .catch(function(error) {
         assert(error.message == 'VM Exception while processing transaction: revert')
      })
  })

  it('should fail when not enough amount sent', function() {
    let APP
    return ETHCards.new(owner)
      .then(function(instance) {
        APP = instance
        return APP.initialBuyCard(5, 'test1', 'url', 'imgurl', {from: account1, value: 950000000000000000})
      })
      .catch(function(error) {
         assert.equal(error.message, 'VM Exception while processing transaction: revert')
      })
  })


  it('should buy card from initialBuyCard', function() {
    let APP
    return ETHCards.new(owner)
      .then(function(instance) {
        APP = instance
        return APP.initialBuyCard(5, 'test1', 'url', 'imgurl', {from: account1, value: 960000000000000000})
      })
      .then(function(res) {
         return APP.getCard(5)
      })
      .then(function(res) {
         assert(res[2] == 'test1')
         assert(res[3] == 'url')
      })
      .then(function(res) {
        // Another account can't initialBuy
        return APP.initialBuyCard(5, 'test2', 'url2', 'imgurl2', {from: account2, value: 970000000000000000})
      })
      .catch(function(error) {
         assert(error.message == 'VM Exception while processing transaction: revert')
      })
      .then(function(res) {
        // Another account can't buy
        return APP.buyCard(5, 'test2', 'url2', 'imgurl2', {from: account2, value: 970000000000000000})
      })
      .catch(function(error) {
         assert(error.message == 'VM Exception while processing transaction: revert')
      })
  })

  it('should init cardDetails', function() {
    let APP
    return ETHCards.new(owner)
      .then(function(instance) {
        APP = instance
        APP.initialBuyCard(5, 'test1', 'url', 'imgurl', {from: account1, value: 960000000000000000})
        return APP.getCardDetails(5)
      })
      .then(function(res) {
        assert.equal(res[1].toNumber(), 960000000000000000) //price
        assert.equal(res[2].toNumber(), 0) //priceLease
        assert.equal(res[3].toNumber(), 0) //leaseDuration
        assert.equal(res[4], false) //availableBuy
        assert.equal(res[5], false) //availableLease
      })
  })

  it('should credit contract owner & GiveETH on initial buy', function() {
    let APP
    return ETHCards.new(owner)
      .then(function(instance) {
        APP = instance
        APP.initialBuyCard(5, 'test2', 'url2', 'imgurl2', {from: account1, value: 960000000000000000})
        APP.initialBuyCard(6, 'test2', 'url2', 'imgurl2', {from: account1, value: 950000000000000000})
        return APP.getBalance({from: owner })
      })
      .then(function(res) {
        assert.equal(res.toNumber(), 1719000000000000000)
        return APP.getBalance({from: giveETH })
      })
      .then(function(res) {
        assert.equal(res.toNumber(), 191000000000000000)
      })
  })

 it('should allow contract owner to set nsfw', function() {
    let APP
    return ETHCards.new(owner)
      .then(function(instance) {
        APP = instance
        APP.initialBuyCard(5, 'test2', 'url2', 'imgurl2', {from: account1, value: 960000000000000000})
        return APP.setNSFW(5, true, { from: account1 })
      })
      .catch(function(error) {
        assert(error.message == 'VM Exception while processing transaction: revert')
        APP.setNSFW(5, true, { from: owner })
        return APP.getCard(5)
      })
      .then((res) => {
        assert.equal(res[5], true)
      })
  })

 it('should reset nsfw flag when user buy', function() {
    let APP
    return ETHCards.new(owner)
      .then(function(instance) {
        APP = instance
        APP.initialBuyCard(5, 'test2', 'url2', 'imgurl2', {from: account1, value: 960000000000000000})
        APP.setNSFW(5, true, { from: owner })
        APP.sellCard(5, 990000000000000000, {from: account1 })
        APP.buyCard(5, 'test2', 'url2', 'imgurl2', {from: account2, value: 990000000000000000})
        return APP.getCard(5)
      })
      .then((res) => {
        assert.equal(res[5], false)
      })
  })

  it('should set card to sell', function() {
    let APP
    return ETHCards.new(owner)
      .then(function(instance) {
        APP = instance
        APP.initialBuyCard(5, 'test2', 'url2', 'imgurl2', {from: account1, value: 960000000000000000})
        APP.sellCard(5, 1000000000000000000, {from: account1 })
        return APP.getCardDetails(5)
      })
      .then(function(res) {
        assert(res[1].toNumber() == 1000000000000000000)
      })
  })

  it('should fail if non-owner try to sell card', function() {
    let APP
    return ETHCards.new(owner)
      .then(function(instance) {
        APP = instance
        APP.initialBuyCard(5, 'test2', 'url2', 'imgurl2', {from: account1, value: 960000000000000000})
        return APP.sellCard(5, 560000000000000000, {from: account2 })
      })
      .catch(function(error) {
        assert(error.message == 'VM Exception while processing transaction: revert')
      })
  })

  it('should fail when not sufficient amount when buying card from user', function() {
    let APP
    return ETHCards.new(owner)
      .then(function(instance) {
        APP = instance
        APP.initialBuyCard(5, 'test2', 'url2', 'imgurl2', {from: account1, value: 960000000000000000})
        APP.sellCard(5, 990000000000000000, {from: account1 })
        return APP.buyCard(5, 'test2', 'url2', 'imgurl2', {from: account2, value: 960000000000000000})
      })
      .catch(function(error) {
        assert(error.message == 'VM Exception while processing transaction: revert')
      })
  })

  it('should credit user on card buy', function() {
    let APP
    return ETHCards.new(owner)
      .then(function(instance) {
        APP = instance
        APP.initialBuyCard(5, 'test2', 'url2', 'imgurl2', {from: account1, value: 1230000000000000000})
        APP.initialBuyCard(7, 'test2', 'url2', 'imgurl2', {from: account1, value: 1210000000000000000})
        APP.sellCard(5, 1000000000000000000, {from: account1 })
        APP.sellCard(7, 3110000000000000000, {from: account1 })
        APP.buyCard(5, 'test2', 'url2', 'imgurl2', {from: account2, value: 1000000000000000000})
        //APP.buyCard(7, 'test2', 'url2', 'imgurl2', {from: account2, value: 3110000000000000000})
        return APP.getBalance({from: account1 })
      })
      .then(function(res) {
        assert.equal(res.toNumber(), 990000000000000000) // After owner cut
        return APP.getBalance({from: owner })
      })
      .then(function(res) {
        // (1230000000000000000 + 1210000000000000000) + 10000000000000000
        // (initialBuyCard(5) + initialBuyCard(7)) + owner cut buyCard(5) - giveETHCut(10%)
        assert.equal(res.toNumber(), 2206000000000000000) // After owner cut
      })
  })

  it('should withdraw to withdraw wallet', function() {
    let APP
    return ETHCards.new(owner)
      .then(function(instance) {
        APP = instance
        APP.initialBuyCard(5, 'test2', 'url2', 'imgurl2', {from: account1, value: 960000000000000000})
        APP.initialBuyCard(6, 'test2', 'url2', 'imgurl2', {from: account1, value: 950000000000000000})
        APP.withdraw({from: owner })
        return APP.getBalance({from: owner })
      })
      .then(function(res) {
        assert(res.toNumber() == 0)
      })
  })

  it('should fail to transfer card for non-owner', function() {
    let APP
    return ETHCards.new(owner)
      .then(function(instance) {
        APP = instance
        APP.initialBuyCard(5, 'test2', 'url2', 'imgurl2', {from: account1, value: 960000000000000000})
        return APP.transferCardOwnership(account2, 5, {from: account2 })
      })
      .catch(function(error) {
        assert(error.message == 'VM Exception while processing transaction: revert')
      })
      .then(() => {
        return APP.transferCardOwnership(account2, 1, {from: account2 })
      })
      .catch(function(error) {
        assert(error.message == 'VM Exception while processing transaction: revert')
      })
  })

  it('should transfer card ownership', function() {
    let APP
    return ETHCards.new(owner)
      .then(function(instance) {
        APP = instance
        APP.initialBuyCard(5, 'test2', 'url2', 'imgurl2', {from: account1, value: 960000000000000000})
        APP.transferCardOwnership(account2, 5, {from: account1 })
        return APP.getCard(5)
      })
      .then((res) => {
        assert(res[1] === account2)
      })
  })

  it('should return correct sell availability', function() {
    let APP
    return ETHCards.new(owner)
      .then(function(instance) {
        APP = instance
        return APP.getCardDetails(5)
      })
      .then((res) => {
        // At beginning, it should be available (=initial sell)
        assert.equal(res[4], true)
        APP.initialBuyCard(5, 'test2', 'url2', 'imgurl2', {from: account1, value: 960000000000000000})
        return APP.getCardDetails(5)
      })
      .then((res) => {
        // When initial sell done, it should not be available
        assert.equal(res[4], false)
        APP.sellCard(5, 990000000000000000, {from: account1 })
        return APP.getCardDetails(5)
      })
      .then((res) => {
        // Finally, it should set availability to true when owner set it
        // Availability test on cancel offer is done in it('should cancel sell offer')
        assert.equal(res[4], true)
      })
  })

  it('should cancel sell offer', function() {
    let APP
    return ETHCards.new(owner)
      .then(function(instance) {
        APP = instance
        APP.initialBuyCard(5, 'test2', 'url2', 'imgurl2', {from: account1, value: 960000000000000000})
        APP.sellCard(5, 990000000000000000, {from: account1 })
        return APP.cancelSellCard(5, {from: account2 })
      })
      .catch(function(error) {
        // Only card owner can cancel
        assert(error.message == 'VM Exception while processing transaction: revert')
        APP.cancelSellCard(5, {from: account1 })
        return APP.getCardDetails(5)
      })
      .then((res) => {
        assert.equal(res[4], false)
      })
  })

  it('should set card on lease by owner', function() {
    let APP
    return ETHCards.new(owner)
      .then((instance) => {
        APP = instance
        APP.initialBuyCard(5, 'test1', 'url', 'imgurl', {from: account1, value: 960000000000000000})
        return APP.setLeaseCard(5, 12300000000000, 400,  { from: account2 })
      })
      .catch((error) => {
        // Only card owner can set lease
        assert(error.message == 'VM Exception while processing transaction: revert')
        APP.setLeaseCard(5, 12300000000000, 400,  { from: account1 })
        return APP.getCardDetails(5)
      })
      .then((res) => {
        assert.equal(res[2], 12300000000000) // priceLease
        assert.equal(res[3], 400) // blockDuration
        assert.equal(res[5], true) // availableLease
      })
  })

  it('should fail to lease an non yet sold (=initial buy) card', function() {
    let APP
    return ETHCards.new(owner)
      .then((instance) => {
        APP = instance
        APP.initialBuyCard(5, 'test1', 'url', 'imgurl', {from: account1, value: 960000000000000000})
        APP.setLeaseCard(5, 960000000000000, 400,  { from: account1 })
      })
      .catch((error) => {
        assert(error.message == 'VM Exception while processing transaction: revert')
      })
  })

  it('should fail to set lease on an available to sell card', function() {
    let APP
    return ETHCards.new(owner)
      .then((instance) => {
        APP = instance
        APP.initialBuyCard(5, 'test1', 'url', 'imgurl', {from: account1, value: 960000000000000000})
        APP.sellCard(5, 990000000000000000, {from: account1 })
        return APP.setLeaseCard(5, 12300000000000, 400,  { from: account1 })
      })
      .catch((error) => {
        assert(error.message == 'VM Exception while processing transaction: revert')
      })
  })

  it('should fail when user try to lease a card already in lease', function() {
    let APP
    return ETHCards.new(owner)
      .then((instance) => {
        APP = instance
        APP.initialBuyCard(5, 'test1', 'url', 'imgurl', {from: account1, value: 960000000000000000})
        APP.setLeaseCard(5, 25000000000000, 4000,  { from: account1 })
        APP.leaseCard(5, 'testLEASE', 'urlLEASE', 'imgLEASE', {from: account2, value: 100000000000000000})
        return APP.leaseCard(5, 'testLEASE2', 'urlLEASE2', 'imgLEASE2', {from: owner, value: 100000000000000000})
      })
      .catch((error) => {
        assert(error.message == 'VM Exception while processing transaction: revert')
      })
  })

  it('should fail when user try to lease a card not available to lease', function() {
    let APP
    return ETHCards.new(owner)
      .then((instance) => {
        APP = instance
        APP.initialBuyCard(5, 'test1', 'url', 'imgurl', {from: account1, value: 960000000000000000})
        return APP.leaseCard(5, 'test1', 'url', 'imgurl', {from: account2, value: 960000000000000000})
      })
      .catch((error) => {
        assert(error.message == 'VM Exception while processing transaction: revert')
      })
  })

  it('should fail when user send not enough fund for lease', function() {
    let APP
    return ETHCards.new(owner)
      .then((instance) => {
        APP = instance
        APP.initialBuyCard(5, 'test1', 'url', 'imgurl', {from: account1, value: 960000000000000000})
        APP.setLeaseCard(5, 25000000000000, 4000,  { from: account1 })
        return APP.leaseCard(5, 'test1', 'url', 'imgurl', {from: account2, value: 99999999999999980})
      })
      .catch((error) => {
        assert(error.message == 'VM Exception while processing transaction: revert')
      })
  })

  it('should lease a card to user', function() {
    let APP
    return ETHCards.new(owner)
      .then((instance) => {
        APP = instance
        APP.initialBuyCard(5, 'test1', 'url', 'imgurl', {from: account1, value: 960000000000000000})
        APP.setLeaseCard(5, 25000000000000, 4000,  { from: account1 })
        APP.leaseCard(5, 'testLEASE', 'urlLEASE', 'imgLEASE', {from: account2, value: 100000000000000000})
        return APP.getLastLease(5)
      })
      .then((res) => {
        assert.equal(res[0].toNumber(), 1) //id
        assert.equal(res[1], account2) //tenant
        // assert.equal(res[2], account2) //until block
        assert.equal(res[3], 'testLEASE') //title
        assert.equal(res[5], 'imgLEASE') //title
      })
  })

  it('should allow card owner to cancel the lease offer', function() {
    let APP
    return ETHCards.new(owner)
      .then((instance) => {
        APP = instance
        APP.initialBuyCard(5, 'test1', 'url', 'imgurl', {from: account1, value: 960000000000000000})
        APP.setLeaseCard(5, 25000000000000, 4000,  { from: account1 })
        APP.cancelLeaseOffer(5, {from: account1 })
        return APP.getCardDetails(5)
      })
      .then((res) => {
        assert.equal(res[5], false)
      })
  })

  it('should share lease amount correctly', function() {
    let APP
    return ETHCards.new(owner)
      .then((instance) => {
        APP = instance
        APP.initialBuyCard(5, 'test1', 'url', 'imgurl', {from: account1, value: 960000000000000000})
        APP.withdraw({ from: owner }) // Reset contract owner balance
        APP.setLeaseCard(5, 25000000000000, 4000,  { from: account1 })
        APP.leaseCard(5, 'testLEASE', 'urlLEASE', 'imgLEASE', {from: account2, value: 100000000000000000})
        return APP.getBalance({ from: account1 })
      })
      .then((res) => {
        assert.equal(res.toNumber(), 99000000000000000)
        return APP.getBalance({ from: owner })
      })
      .then((res) => {
        assert.equal(res.toNumber(), 1000000000000000)
      })
  })

  it('should fail to edit non-owner card details', function() {
    let APP
    return ETHCards.new(owner)
      .then((instance) => {
        APP = instance
        APP.initialBuyCard(5, 'test1', 'url', 'imgurl', {from: account1, value: 960000000000000000})
        return APP.editCard(5, 'NotPossible', 'ToDo', 'This', {from: account2})
      })
      .catch((error) => {
        assert(error.message == 'VM Exception while processing transaction: revert')
      })
  })

  it('should edit card details', function() {
    let APP
    return ETHCards.new(owner)
      .then((instance) => {
        APP = instance
        APP.initialBuyCard(5, 'test1', 'url', 'imgurl', {from: account1, value: 960000000000000000})
        APP.editCard(5, 'ModifiedTitle', 'ModifiedURL', 'img', {from: account1})
        return APP.getCard(5)
      })
      .then((res) => {
        assert.equal(res[2], 'ModifiedTitle')
        assert.equal(res[3], 'ModifiedURL')
        assert.equal(res[4], 'img')
      })
  })

  it('should buy all', function() {
    let APP
    // This works, but is heavy shit
    /*
    return ETHCards.new(owner)
      .then(function(instance) {
        APP = instance
        for(i = 1 i <= 100 i++) {
          const price = computeInitialPrice(i)
          APP.initialBuyCard(i, 'test' + i, 'url'+i, 'imgurl', {from: account1, value: price})
        }
        return APP.getBalance({from: owner })
      })
      .then((res) => {
        assert.equal(res.toNumber(), 73143000000000000000)
        return APP.getBalance({from: giveETH })
      })
      .then((res) => {
        assert.equal(res.toNumber(), 8127000000000000000)
      })
      */
  })

})