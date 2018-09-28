import React, { Component } from "react";
import { Table } from "reactstrap";
import { connect } from "react-redux";
import moment from "moment";

function formatTicketRange(startNum, endNum) {
  if (startNum === endNum) {
    return startNum;
  }
  return `[ ${startNum} - ${endNum} ]`;
}

class OwnerTicketList extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "PL_TICKETS_FETCH_REQUESTED",
      payload: {}
    });
  }

  render() {
    const { playertickets, ticketPrice } = this.props;
    const { list } = playertickets;

    return (
      <div>
        <Table className="table-striped table-light table-bordered">
          <thead className="thead-light">
            <tr>
              <th>Cost</th>
              <th>Ticket Range</th>
            </tr>
          </thead>
          <tbody>
            {list.map(item => (
              <tr key={item.ticketStartNumber}>
                <th scope="row">
                  {(item.ticketEndNumber - item.ticketStartNumber + 1) *
                    ticketPrice}
                </th>
                <td>
                  {formatTicketRange(
                    item.ticketStartNumber,
                    item.ticketEndNumber
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = ({ playertickets, global }) => ({
  playertickets,
  ticketPrice: global.gameConfigs.ticketPrice
});

export default connect(mapStateToProps)(OwnerTicketList);
