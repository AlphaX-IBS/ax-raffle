import React, { PureComponent } from "react";
import Stepper from "react-stepper-horizontal";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import { connect } from "react-redux";
import CostEstimation from "./../CostEstimation/index";
import { BigNumber } from "bignumber.js";
import Loader from "react-loader-spinner";
import { getEtherscan, shortenAddress } from "../../../../utils/computils";

class TokenToTicketExchanger extends PureComponent {
  state = {
    steps: [
      {
        title: "Transfer Token"
      },
      {
        title: "Buy Tickets"
      }
    ],
    currentStep: 0,
    executing: false,
    gas: 700000,
    gasprice: 2000000000
  };

  componentWillReceiveProps(nextProps) {
    const { currentStep, executing } = this.state;
    const { status } = nextProps;
    if ("approved" === status) {
      if (executing) {
        this.setState({ currentStep: currentStep + 1, executing: false });
      }
    } else if ("ready" === status) {
      this.setState({ currentStep: 0, executing: false });
    }
  }

  onGasChange = e => {
    const { gas } = this.state;
    if (e.target.value !== undefined && e.target.value !== gas) {
      this.setState({ gas: e.target.value });
    }
  };

  onGasPriceChange = e => {
    const { gasprice } = this.state;
    if (e.target.value !== undefined && e.target.value !== gasprice) {
      this.setState({ gasprice: e.target.value });
    }
  };

  onClickProceed = () => {
    const { currentStep } = this.state;
    const { dispatch, cryptoCurrency, ticketAmount, toggle } = this.props;

    const estimatedGas = this.props.estimatedGas || this.state.gas;

    switch (currentStep) {
      case 0:
        dispatch({
          type: "PL_TICKETS_BUY_REQUESTED",
          payload: {
            type: "TRANSFER_TOKENS",
            payload: {
              cryptoCurrency,
              ticketAmount,
              gas: estimatedGas
            }
          }
        });
        this.setState({ executing: true });
        break;
      case 1:
        dispatch({
          type: "PL_TICKETS_BUY_REQUESTED",
          payload: {
            type: "EXCHANGE_FOR_TICKETS",
            payload: {
              cryptoCurrency,
              ticketAmount,
              gas: estimatedGas
            }
          }
        });
        toggle();
        break;
      default:
    }
  };

  onCancel = () => {
    const { dispatch, toggle } = this.props;
    dispatch({
      type: "PL_TICKETS_BUY_REQUESTED",
      payload: {
        type: "CANCEL_EXCHANGE",
        payload: {}
      }
    });
    toggle();
  };

  render() {
    const { steps, currentStep, executing, gas, gasprice } = this.state;
    const {
      isOpen,
      toggle,
      className,
      ticketAmount,
      cryptoCurrency,
      txHash,
      networkid
    } = this.props;

    const totalCostAsBigNum = cryptoCurrency.displayValue.multipliedBy(
      ticketAmount
    );

    const txHashNode = txHash ? (
      <div className="t2texchange-footer-info">
        Tx Hash:{" "}
        <a href={getEtherscan(networkid, txHash)}>
          {shortenAddress(txHash, 10, 8)}
        </a>
      </div>
    ) : (
      <div />
    );

    const buttonText = currentStep === steps.length - 1 ? "Buy" : "Next";
    const dialogButtonNode = executing ? (
      <Loader type="ThreeDots" color="#226226" height={16} width={16} />
    ) : (
      buttonText
    );

    return (
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        className={className}
        backdrop="static"
      >
        <ModalHeader toggle={toggle} className="text-center">
          Exchange
        </ModalHeader>
        <ModalBody>
          <Stepper steps={steps} activeStep={currentStep} />
          <CostEstimation
            cost={{
              label: "Ticket cost:",
              value: totalCostAsBigNum.toString()
            }}
            gas={gas}
            gasprice={gasprice}
          />
        </ModalBody>
        <ModalFooter>
          {txHashNode}
          <Button
            disabled={executing}
            color="primary"
            onClick={this.onClickProceed}
          >
            {dialogButtonNode}
          </Button>
          <Button color="secondary" onClick={this.onCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const defaultProps = {
  ticketAmount: 0,
  cryptoCurrency: {
    displayValue: new BigNumber(0)
  }
};
TokenToTicketExchanger.defaultProps = defaultProps;

const mapStateToProps = ({ playeractions, player, api }) => ({
  status: playeractions.status,
  txHash: playeractions.txHash,
  estimatedGas: player.estimatedGas,
  networkid: api.networkid
});

export default connect(mapStateToProps)(TokenToTicketExchanger);
