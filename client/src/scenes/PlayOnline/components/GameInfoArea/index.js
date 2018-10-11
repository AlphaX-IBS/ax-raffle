import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import { Row, Col } from "reactstrap";
import moment from "moment";

class GameInfoArea extends PureComponent {
  render() {
    const {
      globalStatus,
      gamestatus,
      openedTime,
      closedTime,
      totalTickets,
      tokens
    } = this.props;

    if (globalStatus !== "ready") {
      return (
        <Row className="nextdrawtime text-center">
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
      let targetTime = 0;
      let gameMsg = "";
      switch (gamestatus) {
        case "starting":
          gameMsg = "Next Pot Time";
          targetTime = moment(openedTime)
            .format("dddd, MMMM Do YYYY, hh:mm:ss")
            .concat("(GMT)");
          break;
        case "opening":
          gameMsg = "Next Draw Time";
          targetTime = moment(closedTime)
            .format("dddd, MMMM Do YYYY, hh:mm:ss")
            .concat("(GMT)");
          break;
        case "drawing":
          gameMsg = "Drawing";
          targetTime = "---";
          break;
        default:
      }

      const cryptoPricePerTicketNodes = Object.keys(tokens).map(key => {
        const tk = tokens[key];
        return (
          <p key={tk.contract}>
            {tk.displayValue.toString()} {tk.symbol}
          </p>
        );
      });

      return (
        <Row className="nextdrawtime">
          <Col xs={12} className="text-center">
            <strong>{gameMsg}</strong>
            <p>{targetTime}</p>
          </Col>
          <Col xs={6} md={6}>
            <strong>Total tickets (of all players)</strong>
            <p>{Intl.NumberFormat().format(totalTickets)} Tickets</p>
          </Col>
          <Col xs={6} md={6}>
            <strong>Price Per Ticket</strong>
            {cryptoPricePerTicketNodes}
          </Col>
        </Row>
      );
    }
  }
}

const mapStateToProps = ({ global }) => ({
  openedTime: global.potOpenedTimestamp,
  closedTime: global.potClosedTimestamp,
  totalPot: global.totalPot,
  gamestatus: global.gamestatus,
  globalStatus: global.status,
  totalTickets: global.totalTickets | 0,
  ticketPriceInEth: global.ticketPrice,
  tokens: global.supportedTokens
});

export default connect(mapStateToProps)(GameInfoArea);
