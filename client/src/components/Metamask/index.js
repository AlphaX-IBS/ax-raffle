import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Button } from "reactstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import SimpleStorageContract from "../../contracts/SimpleStorage.json";
import getWeb3 from "../../utils/getWeb3";
import truffleContract from "truffle-contract";
import _ from "lodash";

library.add(faCheckCircle);

const checkIcon = <FontAwesomeIcon icon={faCheckCircle} color="green" />;

class Metamask extends Component {
  state = {
    buying: false,
    ticketAmount: 100,
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    changeEvent: () => {}
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const Contract = truffleContract(SimpleStorageContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();

      // instance.once("TicketBought", {}, function(error, event) {
      //   console.log(event);
      // });

      const event = {};
      // console.log("abc;" + JSON.stringify(instance.allEvents()));

      // event.watch((error, logs) => {
      //   console.log(JSON.stringify(logs));
      //   var log = _.filter(logs, filter);
      //   if (log) {
      //     this.loadTickets();
      //   } else {
      //     throw Error("Failed to find filtered event for " + filter.event);
      //   }
      // });

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, changeEvent: event }, this.loadTickets);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  buy = async () => {
    const { contract, ticketAmount, accounts } = this.state;

    this.setState({ buying: true });

    const res = await contract.buyTickets(ticketAmount, { from: accounts[0] });
    console.log(JSON.stringify(res.logs));

    // Get the value from the contract to prove it worked.
    const response = await contract.get();

    this.setState({ buying: false, storageValue: response.toNumber() });
  };

  loadTickets = async () => {
    const { contract } = this.state;

    // Get the value from the contract to prove it worked.
    const response = await contract.get();

    // Update state with the result.
    this.setState({ storageValue: response.toNumber() });
  };

  handleTicketAmountChange = evt => {
    let amount;
    console.log(`Changed = ${JSON.stringify(evt.target.value)}`);
    if (evt.target.value === null || evt.target.value === "") {
      amount = 1;
    } else {
      amount = evt.target.value;
    }
    this.setState({ ticketAmount: amount });
  };

  render() {
    const { ticketAmount, storageValue, buying } = this.state;

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div>
        <b>MetaMask / Mist</b> <br />
        {checkIcon}
        <i>This is a recommended way to access your wallet.</i>
        <p />
        <p>
          MetaMask is a browser extension that allows you to access your wallet
          quickly, safely & easily. It is more secure because you never enter
          your private key on a website. It protects you from phishing &
          malicious websites.
        </p>
        <br />
        <p>Number of tickets was sold: {storageValue}</p>
        <input
          type="number"
          pattern="[0-9]*"
          inputMode="numeric"
          value={ticketAmount}
          min={1}
          onChange={this.handleTicketAmountChange}
        />
        <Button color="primary" loading={buying} onClick={this.buy}>
          Buy
        </Button>
      </div>
    );
  }
}

export default injectIntl(Metamask, { withRef: true });
