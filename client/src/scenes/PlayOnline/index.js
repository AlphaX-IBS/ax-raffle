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
        <Metamask />
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
                  <Table className="table-striped table-light table-bordered">
                    <thead className="thead-light">
                      <tr>
                        <th>Total tickets</th>
                        <th>Win chance</th>
                        <th>Nick Name</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">10</th>
                        <td>1.001%</td>
                        <td>Otto</td>
                        <td>100</td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>0.005</td>
                        <td>Thornton</td>
                        <td>20</td>
                      </tr>
                      <tr>
                        <th scope="row">3</th>
                        <td>0.003</td>
                        <td>the Bird</td>
                        <td>30</td>
                      </tr>
                    </tbody>
                  </Table>
                </TabPane>
                <TabPane tabId="2">
                  <Table className="table-striped table-light table-bordered">
                    <thead className="thead-light">
                      <tr>
                        <th>Round</th>
                        <th>Ticket ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>12341231234</td>
                      </tr>
                      <tr>
                        <th scope="row">1</th>
                        <td>54674564334</td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>34563456366</td>
                      </tr>
                    </tbody>
                  </Table>
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
