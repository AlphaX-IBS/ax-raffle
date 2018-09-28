import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Table } from "reactstrap";
import GgLikedPagination from "./../../../../components/GgLikedPagination/index";

class RoundTicketList extends PureComponent {
  state = {
    pageSize: 2,
    page: 1
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageSize, page } = this.state;

    dispatch({
      type: "TICKET_FETCH_REQUESTED",
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
        type: "TICKET_FETCH_REQUESTED",
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
    const { list, totalTickets, totalPotPlayers } = this.props;

    const startIndex = pageSize * Math.max(0, page - 1);
    const data = list.slice(startIndex, startIndex + pageSize);

    return (
      <div>
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
            {data.map(item => (
              <tr key={item.playerAddress}>
                <th scope="row">{item.totalTickets}</th>
                <td>
                  {((item.totalTickets / totalTickets) * 100).toFixed(2)}%
                </td>
                <td>
                  {item.playerAddress.substr(0, 6)}
                  ...
                  {item.playerAddress.substr(
                    item.playerAddress.length - 4,
                    item.playerAddress.length
                  )}
                </td>
                <td>{item.totalTickets / 1000}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <GgLikedPagination
          pageSize={pageSize}
          totalItems={totalPotPlayers}
          onChangePage={this.handlePageClick}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ pot, tickets }) => ({
  list: tickets.list ? tickets.list : [],
  totalTickets: pot.totalTickets,
  totalPotPlayers: pot.totalPotPlayers
});
export default connect(mapStateToProps)(RoundTicketList);
