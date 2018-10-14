import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { BN } from 'bn.js';

function buildYourCost(usedTokens, supportedTokens) {
  let result = [];
  for (let i = 0; i < usedTokens.length; i++) {
    const usedToken = usedTokens[i];
    const supToken = supportedTokens[usedToken.tokenAddress];
    const tokenSymbol = supToken.symbol;
    const amount = usedToken.tokenAmount.div(new BN("1000000000000000000"));
    const text = amount.toString().concat(" ", tokenSymbol);
    result.push(<div key={usedToken.tokenAddress} className="col-6 text-center">{text}</div>);
  }
  return result;
}
class ChanceRateReport extends PureComponent {
  render() {
    const {
      totalPlayerTickets,
      totalTickets,
      plUsedTokens,
      supportedTokens
    } = this.props;
    const plTicketsMsg = totalPlayerTickets ? totalPlayerTickets : "-";
    const winRateMsg =
      totalTickets > 0
        ? ((totalPlayerTickets / totalTickets) * 100).toFixed(3)
        : "-";
    const cryptoExpenseNodes = buildYourCost(plUsedTokens, supportedTokens);
    return (
      <div className="row-winchance">
        <div className="row">
          <div className="col-6 text-center">
            <strong>Your tickets</strong>
            <br />
            <strong>{plTicketsMsg}</strong>
          </div>
          <div className="col-6 text-center">
            <strong>Your win chance</strong>
            <br />
            <strong>{winRateMsg}%</strong>
          </div>
        </div>
        <div className="row">
          <div className="col-12 text-center">
            <strong>Your cost</strong>
          </div>
          {cryptoExpenseNodes}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ playertickets, global }) => ({
  totalPlayerTickets: playertickets.totalPlTickets,
  totalTickets: global.totalTickets,
  supportedTokens: global.supportedTokens,
  plUsedTokens: playertickets.plUsedTokens
});

export default connect(mapStateToProps)(ChanceRateReport);
