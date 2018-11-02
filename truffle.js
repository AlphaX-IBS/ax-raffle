
var HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const privateKeys = ["your private key"];

module.exports = {
  contracts_build_directory: "/usr/src/app/client/src/contracts",
  networks: {
    localhost: {
      provider: function() {
        return new HDWalletProvider(privateKeys, "http://localhost:8545");
      },
      network_id: "*", 
      gas: 6498712,
      gasPrice: 100000000000
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(privateKeys, "https://ropsten.infura.io");
      },
      gas: 4712388,
      gasPrice: 100000000000,
      network_id: '3'
    }
  },
  solc: {
      optimizer: {
          enabled: true,
          runs: 200
      }
  }
};