import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Button } from "reactstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import message from "../message";

library.add(faCheckCircle);

const checkIcon = <FontAwesomeIcon icon={faCheckCircle} color="green" />;

class Metamask extends Component {
  state = {
    loading: false,
    ticketAmount: 100
  };

  connect = () => {
    if (!window.web3) {
      message.error(`Metamask is not installed`);
      return false;
    }

    // Metamask extension inject its own 'web3' to window when installed
    const { web3 } = window;
    this.setState({
      loading: true
    });

    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

    web3.eth.getAccounts((err, accounts) => {
      if (err != null) message.error(`An error occurred: ${err}`);
      else if (accounts.length === 0) {
        message.error("User is not logged in to MetaMask");
      } else {
        const accAddress = accounts[0];
        console.log(`1st acc = ${accAddress}, ${contractAddress}`);
        // test transaction
        web3.eth.sendTransaction(
          {
            from: { accAddress },
            to: { contractAddress },
            value: web3.toWei("0"),
            gasPrice: web3.toWei("30", "gwei")
          },
          (error, mes) => {
            if (error) message.error(error.message);
            if (mes) message.success(mes.message);
          }
        );
      }

      this.setState({
        loading: false
      });
    });
  };

  handleTicketAmountChange = evt => {
    let amount;
    console.log(`Changed = ${JSON.stringify(evt.target.value)}`);
    if (evt.target.value === null || evt.target.value === "") {
      amount = 0;
    } else {
      amount = evt.target.value;
    }
    this.setState({ ticketAmount: amount });
  };

  render() {
    const { loading, ticketAmount } = this.state;

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
        <input
          type="number"
          pattern="[0-9]*"
          inputmode="numeric"
          defaultValue={ticketAmount}
          onChange={this.handleTicketAmountChange}
        />
        <Button color="primary" loading={loading} onClick={this.connect}>
          Buy
        </Button>
      </div>
    );
  }
}

export default injectIntl(Metamask, { withRef: true });
