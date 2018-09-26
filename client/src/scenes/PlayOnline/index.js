import React, { PureComponent } from "react";
import classnames from "classnames";
import {
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupText,
  Button,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter
} from "reactstrap";
import RoundTicketList from "./components/RoundTicketList";
import OwnerTicketList from "./components/OwnerTicketList/index";
import { connect } from "react-redux";
import ChanceRateReport from "./components/ChanceRateReport";

class PlayOnline extends PureComponent {
  state = {
    activeTab: "1",
    nextTab: null,
    modal: false
  };

  componentDidUpdate() {
    const { account } = this.props;
    const { nextTab } = this.state;
    if (account && nextTab) {
      this.setState({
        nextTab: null
      });
      this.toggle(nextTab);
    }
  }

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      if (tab === "2") {
        if (this.props.account) {
          this.setState({
            activeTab: tab
          });
        } else {
          this.setState({
            nextTab: tab
          });
          this.toggleModal();
        }
      } else {
        this.setState({
          activeTab: tab
        });
      }
    }
  };

  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  connectAccount = () => {
    const { dispatch } = this.props;
    dispatch({ type: "WEB3_FETCH_REQUESTED", payload: {} });
    this.setState({
      modal: !this.state.modal
    });
  };

  render() {
    const { modal } = this.state;
    return (
      <div className="play-online">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="row row-playonline justify-content-center">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Quantity</InputGroupText>
                  </InputGroupAddon>
                  <Input className="text-center" placeholder="1000 Tickets" />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>Total cost: 0.1 ETH</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <Button color="primary">Buy Now</Button>
              </div>
              <ChanceRateReport />
              <Row className="row-howitwork">
                <Col>
                  <h3>How it work?</h3>
                  <p>
                    What is this game? This game is called lottery. You can buy
                    lottery tickets and hope that one of your ticket numbers
                    will be picked. The draw takes place once per week, on
                    Thursday. How to play Click on tab "Buy ticket" and enter
                    number of tickets you want to buy. Each ticket costs 0.0015
                    ETH. You can buy tickets only with Ether. Lots will be drawn
                    each week on thursday using random numbers generated through
                  </p>
                </Col>
              </Row>
            </div>
            <div className="col-md-6">
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "1"
                    })}
                    onClick={() => {
                      this.toggle("1");
                    }}
                  >
                    This round tickets
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "2"
                    })}
                    onClick={() => {
                      this.toggle("2");
                    }}
                  >
                    Your tickets
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <RoundTicketList />
                </TabPane>
                <TabPane tabId="2">
                  <OwnerTicketList />
                </TabPane>
              </TabContent>
            </div>
          </div>
          <Modal
            isOpen={modal}
            toggle={this.toggleModal}
            className={this.props.className}
          >
            <ModalHeader toggle={this.toggleModal}>
              Connect Metamask
            </ModalHeader>
            <ModalBody>
              Connecting to Metamask is required to use this function.
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.connectAccount}>
                Connect
              </Button>{" "}
              <Button color="secondary" onClick={this.toggleModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ player }) => ({
  account: player.accounts.length > 0 ? player.accounts[0] : undefined,
});

export default connect(mapStateToProps)(PlayOnline);
