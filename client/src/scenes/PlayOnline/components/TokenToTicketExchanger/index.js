import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Stepper from "react-stepper-horizontal";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import { connect } from "react-redux";

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
    executing: false
  };

  componentWillReceiveProps(nextProps) {
    const { currentStep, executing } = this.state;
    const { txHash } = nextProps;
    if (txHash && executing) {
      this.setState({ currentStep: currentStep + 1, executing: false });
    }
  }

  onClickProceed = () => {
    const { steps, currentStep, executing } = this.state;
    const { dispatch, cryptoCurrency, ticketAmount, toggle } = this.props;
    switch (currentStep) {
      case 0:
        dispatch({
          type: "PL_TICKETS_BUY_REQUESTED",
          payload: {
            type: "TRANSFER_TOKENS",
            payload: {
              cryptoCurrency,
              ticketAmount,
              gas: 0 // TODO: require input later
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
              gas: 0 // TODO: require input later
            }
          }
        });
        toggle();
        break;
      default:
    }
  };

  render() {
    const { steps, currentStep, executing } = this.state;
    const { isOpen, toggle, className } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle} className={className}>
        <ModalHeader toggle={this.toggleInfoModal} className="text-center">
          Exchange
        </ModalHeader>
        <ModalBody>
          <Stepper steps={steps} activeStep={currentStep} />
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={executing}
            color="primary"
            onClick={this.onClickProceed}
          >
            {currentStep == steps.length - 1 ? "Buy" : "Next"}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = ({ playeractions }) => ({
  txHash: playeractions.txHash
});

export default connect(mapStateToProps)(TokenToTicketExchanger);
