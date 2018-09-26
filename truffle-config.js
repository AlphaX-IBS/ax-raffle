// var HDWalletProvider = require("truffle-hdwallet-provider");

// var mnemonic = "mountains supernatural bird ...";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // Match any network id
    },
    // ropsten: {
    //   // must be a thunk, otherwise truffle commands may hang in CI
    //   provider: () =>
    //     new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"),
    //   network_id: '3',
    // }
  }
};
