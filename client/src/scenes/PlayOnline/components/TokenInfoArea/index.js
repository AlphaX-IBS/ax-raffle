import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import { Row, Col, UncontrolledTooltip, Container } from "reactstrap";

class GameInfoArea extends PureComponent {
  render() {
    const { globalStatus, potTokens, totalPot } = this.props;

    let nodes = [];
    if (globalStatus === "ready" && Object.keys(potTokens).length > 0) {
      const data = Object.keys(potTokens).map(address => {
        const tk = potTokens[address];
        return tk;
      });

      nodes = data.map(item => {
        return (
          <Col key={item.tokenAddress} className="text-nowrap" xs={6} md={6}>
            <strong>{`${item.tokenSymbol} amount`}</strong>
            <p id={`${item.tokenSymbol}-amount`}>
              {item.tokenAmtDisplayValue.toString()} {item.tokenSymbol}
            </p>
            <UncontrolledTooltip
              placement="bottom"
              target={`${item.tokenSymbol}-amount`}
            >
              {item.tokenAmtDisplayValue.toString()}
            </UncontrolledTooltip>
          </Col>
        );
      });

      //   console.log(JSON.stringify(nodes));
    }

    if (globalStatus !== "ready") {
      return (
        <Container className="totalpotamount text-center justify-content-center">
          <div style={{ width: "100%" }}>
            <Loader
              type="Ball-Triangle"
              color="#226226"
              height={64}
              width={64}
            />
          </div>
        </Container>
      );
    } else {
      return (
        <Container className="totalpotamount text-center justify-content-center">
          <Row>
            <Col>
              <strong>Total amount (ETH and all ERC20 Tokens)</strong>
              <p>{totalPot} ETH</p>
            </Col>
          </Row>
          <Row>
            {nodes}
          </Row>
        </Container>
      );
    }
  }
}

const mapStateToProps = ({ global }) => ({
  gamestatus: global.gamestatus,
  globalStatus: global.status,
  potTokens: global.potTokens,
  totalPot: global.totalPot
});

export default connect(mapStateToProps)(GameInfoArea);
