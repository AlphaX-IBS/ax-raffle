import React, { PureComponent } from "react";
import Metamask from "../../components/Metamask";
import classnames from "classnames";
import {
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupText,
  Button,
  Table,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardTitle,
  CardText,
  Row,
  Col
} from "reactstrap";
import RoundTicketList from "./components/RoundTicketList";
import OwnerTicketList from './components/OwnerTicketList/index';

class PlayOnline extends PureComponent {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: "1"
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  render() {
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
              <div className="row row-winchance">
                <div className="col-6 text-center">
                  <strong>Your ticketks:</strong>
                  <br />
                  <strong>0</strong>
                </div>
                <div className="col-6 text-center">
                  <strong>Your win chance</strong>
                  <br />
                  <strong>0,000%</strong>
                </div>
              </div>
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
        </div>
      </div>
    );
  }
}

export default PlayOnline;
