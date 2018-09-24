const Web3 = require('web3');
const web3 = new Web3("ws://localhost:8545");

const AxRaffle = artifacts.require("./AxRaffle.sol");

contract("AxRaffle", accounts => {
  it("...should return 10 tickets, ceiling is 10", async () => {
    const instance = await AxRaffle.deployed();
    //send 0.05eth to contract
    //since the ticket price is 0.005eth (set in the 2_deploy_contract function)
    //this should buy 10 tickets
    await instance.purchaseTicketsByEther({
        value: 0.05 * 10 ** 18
    })

    const numberOfTickets = await instance.numberOfTickets();
    assert.equal(numberOfTickets, 10, 'purchase returned ' + numberOfTickets);

    const ceiling = await instance.ticketNumberCeiling();
    assert.equal(ceiling, 10, 'ceiling is ' + ceiling);
  });

  it("test this with an odd number, should return 8 tickets, ticket starts from 11 and end at 18", async () => {
    const instance = await AxRaffle.deployed();
    //send 0.042eth to contract
    //now this returns 8
    //missed 0.002eth, we should make sure users dont sent (values % 5 != 0) to contract
    await instance.purchaseTicketsByEther({
        value: 0.042 * 10 ** 18
    })

    const numberOfTickets = await instance.numberOfTickets();
    assert.equal(numberOfTickets, 8, 'purchase returned ' + numberOfTickets);

    const ceiling = await instance.ticketNumberCeiling();
    assert.equal(ceiling, 18, 'ceiling is ' + ceiling);
  });
});
