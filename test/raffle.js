const Web3 = require('web3');
const web3 = new Web3("ws://localhost:8545");

const AxRaffle = artifacts.require("./AxRaffle.sol");

contract("AxRaffle", accounts => {
  it("activate the game", async() => {
    const instance = await AxRaffle.deployed();

    await instance.activateGame();
  })

  it("buy tickets from other accounts", (done) => {
    AxRaffle.deployed().then(instance => {
      let promises = [];

      for(let i = 0; i < accounts.length; i++){
        let randomEth = Math.random();
        promises.push(instance.sendTransaction({
          from: accounts[i],
          value: randomEth * 10 ** 18
        }))
      }
      // instance.contract.allEvents((err, event) => {
      //   assert(!err, err);
      //   console.log(event);
      // });

      return Promise.all(promises);
    }).then(() => {
      done()
    })
  });

  it("should draw ticket", (done) => {
      //make sure to draw pot after game is closed (initially set 4s as duration)
      AxRaffle.deployed().then(instance => {
        // instance.contract.allEvents((err, event) => {
        //   assert(!err, err);
        //   console.log(event);
        // });
        setTimeout(() => {
          instance.drawTicket().then(result => {
            //console.log(result);
            done();
          })
        }, 4000)
      })
  })

  it("should deactivate game", (done) => {
    AxRaffle.deployed().then(instance => {
      return instance.deactivateGame()
    }).then(() => done());
  })
});
