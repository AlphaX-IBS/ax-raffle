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
    const { playertickets } = this.props;
    const { list } = playertickets;

    return (
      <div>
        <Table className="table-striped table-light table-bordered">
          <thead className="thead-light">
            <tr>
              <th>Time</th>
              <th>Ticket Range</th>
            </tr>
          </thead>
          <tbody>
            {list.map(item => (
              <tr key={item.timestamp}>
                <th scope="row">
                  {moment(item.timestamp).format("YYYY-MM-DD HH:mm:ss")}
                </th>
                <td>{formatTicketRange(item.startNum, item.endNum)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = ({ playertickets }) => ({
  playertickets
});

export default connect(mapStateToProps)(OwnerTicketList);
