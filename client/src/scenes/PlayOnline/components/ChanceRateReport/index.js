import React, { PureComponent } from "react";
import { connect } from "react-redux";

class ChanceRateReport extends PureComponent {
  render() {
    const { totalPlayerTickets, totalTickets } = this.props;
    console.log(JSON.stringify(this.props));
    const winRate = ((totalPlayerTickets / totalTickets) * 100).toFixed(3);
    return (
      <div className="row row-winchance">
        <div className="col-6 text-center">
          <strong>Your tickets:</strong>
          <br />
          <strong>{totalPlayerTickets}</strong>
        </div>
        <div className="col-6 text-center">
          <strong>Your win chance</strong>
          <br />
          <strong>{winRate}%</strong>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ playertickets, pot }) => ({
  totalPlayerTickets: playertickets.totalPlTickets,
  totalTickets: pot.totalTickets
});

export default connect(mapStateToProps)(ChanceRateReport);
