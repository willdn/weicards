# WeiCards

WeiCards let you buy, lease and sell cards on the Ethereum blockchain.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at http://localhost:8080
npm run dev

# build for production with minification
npm run build
```

You can set up a developement Ethereum node with [truffle](http://truffleframework.com/) :

``` bash
# Run node
truffle develop

# Compile contracts
truffle compile

# Migrate contracts
truffle migrate
```


## Test

``` bash
# Run truffle test
truffle test ./test/weicards.js --network test
```