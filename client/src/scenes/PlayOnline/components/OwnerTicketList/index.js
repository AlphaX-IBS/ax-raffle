import React, { Component } from "react";
import { Table } from "reactstrap";
import { connect } from "react-redux";
import GgLikedPagination from "../../../../components/GgLikedPagination";

function formatTicketRange(startNum, endNum) {
  if (startNum === endNum) {
    return startNum;
  }
  return `[ ${startNum} - ${endNum} ]`;
}

class OwnerTicketList extends Component {
  state = {
    pageSize: 2,
    page: 1
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageSize, page } = this.state;

    dispatch({
      type: "PL_TICKETS_FETCH_REQUESTED",
      payload: {
        pageSize,
        page
      }
    });
  }

  handlePageClick = selectedPage => {
    const { pageSize, page } = this.state;
    const { dispatch } = this.props;
    if (page !== selectedPage) {
      dispatch({
        type: "WINNERS_FETCH_REQUESTED",
        payload: {
          pageSize,
          page: selectedPage
        }
      });
      this.setState({ page: selectedPage });
    }
  };

  render() {
    const { pageSize, page } = this.state;
    const { playertickets, ticketPrice } = this.props;
    const { list } = playertickets;

    const startIndex = pageSize * Math.max(0, page - 1);
    const data = list.slice(startIndex, startIndex + pageSize);

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
            {data.map(item => (
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
        <GgLikedPagination
          pageSize={pageSize}
          totalItems={list.length}
          onChangePage={this.handlePageClick}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ playertickets, global }) => ({
  playertickets,
  ticketPrice: global.gameConfigs.ticketPrice
});

export default connect(mapStateToProps)(OwnerTicketList);
