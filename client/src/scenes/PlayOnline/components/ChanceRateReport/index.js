import React, { PureComponent } from "react";
import { connect } from "react-redux";

class ChanceRateReport extends PureComponent {
  render() {
    const { totalPlayerTickets, totalTickets } = this.props;
    const plTicketsMsg = totalPlayerTickets ? totalPlayerTickets : "-";
    const winRateMsg =
      totalTickets > 0
        ? ((totalPlayerTickets / totalTickets) * 100).toFixed(3)
        : "-";
    return (
      <div className="row row-winchance">
        <div className="col-6 text-center">
          <strong>Your tickets:</strong>
          <br />
          <strong>{plTicketsMsg}</strong>
        </div>
        <div className="col-6 text-center">
          <strong>Your win chance</strong>
          <br />
          <strong>{winRateMsg}%</strong>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ playertickets, global }) => ({
  totalPlayerTickets: playertickets.totalPlTickets,
  totalTickets: global.totalTickets
});

export default connect(mapStateToProps)(ChanceRateReport);
