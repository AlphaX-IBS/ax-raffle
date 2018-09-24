var AxRaffle = artifacts.require("./AxRaffle.sol");

module.exports = function(deployer, network, accounts) {
  //deploy contract with ticket price = 0.005eth (equals to 5000000000000000 wei)
  deployer.deploy(AxRaffle, accounts[0], 0, 1000, 2000, true, 5000000000000000, 10, 1);
};
