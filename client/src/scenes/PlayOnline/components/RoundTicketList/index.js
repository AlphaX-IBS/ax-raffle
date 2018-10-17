import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import { Table } from "reactstrap";
import GgLikedPagination from "./../../../../components/GgLikedPagination/index";
import { buildAmountString, getEtherscan } from "./../../../../utils/computils";

class RoundTicketList extends PureComponent {
  state = {
    pageSize: 6,
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
    const {
      loading,
      list,
      totalTickets,
      totalPotPlayers,
      supportedTokens,
      networkid
    } = this.props;

    if (loading) {
      return (
        <Loader type="Ball-Triangle" color="#226226" height={80} width={80} />
      );
    }

    const startIndex = pageSize * Math.max(0, page - 1);
    const data = list.slice(startIndex, startIndex + pageSize);

    return (
      <div>
        <Table className="table-striped table-light table-bordered">
          <thead className="thead-light">
            <tr>
              <th>Total tickets</th>
              <th>Win chance</th>
              <th>Player</th>
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
                  <a target="_blank" href={getEtherscan(networkid, item.playerAddress)}>
                    {item.playerAddress.substr(0, 6)}
                    ...
                    {item.playerAddress.substr(
                      item.playerAddress.length - 4,
                      item.playerAddress.length
                    )}
                  </a>
                </td>
                <td>{buildAmountString(item.usedTokens, supportedTokens)}</td>
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

const mapStateToProps = ({ global, tickets }) => ({
  loading: global.status === "ready" ? false : true,
  list: tickets.list ? tickets.list : [],
  totalTickets: global.totalTickets,
  totalPotPlayers: global.totalPotPlayers,
  supportedTokens: global.supportedTokens,
  networkid: global.networkid
});
export default connect(mapStateToProps)(RoundTicketList);
