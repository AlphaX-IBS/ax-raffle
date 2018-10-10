import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import { negativePowerOfTen } from "./../../../../utils/numeric";
import { Row, Col, UncontrolledTooltip } from "reactstrap";
import BigNumber from "bignumber.js";

class GameInfoArea extends PureComponent {
  render() {
    const { globalStatus, tokens, ticketPriceInEth } = this.props;

    let nodes = [];
    if (globalStatus === "ready" && Object.keys(tokens).length > 0) {
      const data = Object.keys(tokens).map(address => {
        const tk = tokens[address];
        const symbol = tk.symbol.replace(/\u0000/g, "");
        const amountInWeiAsStr = tk.amountPerTicket.toString();
        const power = tk.decimals.toNumber();
        const amountAsStr = negativePowerOfTen(amountInWeiAsStr, power);
        console.log(`num=${amountAsStr}`);
        return {
          symbol,
          amount: new BigNumber(amountAsStr)
        };
      });

      nodes = data.map(item => {
        console.log(item.amount.toString());
        return (
          <Col key={item.symbol} className="text-nowrap" xs={6} md={6}>
            <strong>{`${item.symbol} amount`}</strong>
            <p id={`${item.symbol}-amount`}>
              {item.amount.toFixed(3)} {item.symbol}
            </p>
            <UncontrolledTooltip
              placement="bottom"
              target={`${item.symbol}-amount`}
            >
              {item.amount.toString()}
            </UncontrolledTooltip>
          </Col>
        );
      });

      //   console.log(JSON.stringify(nodes));
    }

    if (globalStatus !== "ready") {
      return (
        <Row className="totalpotamount text-center justify-content-center">
          <div style={{ width: "100%" }}>
            <Loader
              type="Ball-Triangle"
              color="#226226"
              height={64}
              width={64}
            />
          </div>
        </Row>
      );
    } else {
      return (
        <Row className="totalpotamount text-center justify-content-center">
          <Row>
            <Col>
              <strong>Total amount (ETH and all ERC20 Token)</strong>
              <p>100.001 ETH</p>
            </Col>
          </Row>
          <Row>
            <Col xs={6} md={6}>
              <strong>ETH amount</strong>
              <p id="ETH-amount">{ticketPriceInEth} ETH</p>
              <UncontrolledTooltip placement="bottom" target="ETH-amount">
                {ticketPriceInEth}
              </UncontrolledTooltip>
            </Col>
            {nodes}
          </Row>
        </Row>
      );
    }
  }
}

const mapStateToProps = ({ global }) => ({
  gamestatus: global.gamestatus,
  globalStatus: global.status,
  tokens: global.supportedTokens,
  ticketPriceInEth: global.ticketPrice
});

export default connect(mapStateToProps)(GameInfoArea);
