const Web3 = require('web3');
const web3 = new Web3("ws://localhost:8545");

const AxRaffle = artifacts.require("./AxRaffle.sol");

contract("AxRaffle", accounts => {
  it("activate the game", async() => {
    const instance = await AxRaffle.deployed();

    await instance.activateGame();
  })

  it("...should return 2 tickets, ceiling is 2", async () => {
    const instance = await AxRaffle.deployed();
    //send 0.05eth to contract
    //since the ticket price is 0.005eth (set in the 2_deploy_contract function)
    //this should buy 10 tickets
    await instance.purchaseTicketsByEther({
        value: 0.01 * 10 ** 18
    })

    const ceiling = await instance.ticketNumberCeiling();
    assert.equal(ceiling, 2, 'ceiling is ' + ceiling);
  });

  it("test this with an odd number, should return 8 tickets, ticket starts from 3 and end at 10", async () => {
    const instance = await AxRaffle.deployed();
    //send 0.042eth to contract
    //now this returns 8
    //missed 0.002eth
    await instance.purchaseTicketsByEther({
        value: 0.042 * 10 ** 18
    })

    //const numberOfTickets = await instance.numberOfTickets();
    //assert.equal(numberOfTickets, 8, 'purchase returned ' + numberOfTickets);

    const ceiling = await instance.ticketNumberCeiling();
    assert.equal(ceiling, 10, 'ceiling is ' + ceiling);
  });

  it("continue buying tickets from other accounts", (done) => {
    AxRaffle.deployed().then(instance => {
      let promises = [];

      for(let i = 1; i < accounts.length; i++){
        let randomEth = Math.random();
        //console.log('player ' + i + ' is buying ' + randomEth);
        promises.push(instance.purchaseTicketsByEther({
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
        instance.contract.allEvents((err, event) => {
          assert(!err, err);
          console.log(event);
        });
        setTimeout(() => {
          instance.drawTicket().then(result => {
            console.log(result);
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
