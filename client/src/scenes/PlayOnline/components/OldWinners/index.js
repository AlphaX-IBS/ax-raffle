import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Table, UncontrolledTooltip } from "reactstrap";
import GgLikedPagination from "./../../../../components/GgLikedPagination/index";
import moment from "moment";
import { buildAmountString, getEtherscan } from "./../../../../utils/computils";

class OldWinners extends PureComponent {
  state = {
    pageSize: 6,
    page: 1
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageSize, page } = this.state;

    dispatch({
      type: "WINNERS_FETCH_REQUESTED",
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
    const { list, totalWinners, allTokens, networkid } = this.props;

    const startIndex = pageSize * Math.max(0, page - 1);
    const data = list.slice(startIndex, startIndex + pageSize);

    return (
      <div>
        <Table className="table-striped table-light table-bordered">
          <thead className="thead-light">
            <tr>
              <th>Timestamp</th>
              <th>Prize</th>
              <th>Winner</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.round}>
                <td>
                  {moment(item.potEndedTimestamp).format(
                    "YYYY-MM-DD hh:mm:ssZ"
                  )}
                </td>
                <td>{buildAmountString(item.potTokenPrize, allTokens)}</td>
                <td>
                  <a
                    target="_blank"
                    href={getEtherscan(networkid, item.winnerAddress)}
                  >
                    <div id={`WinnerAddress-${item.round}`}>
                      {item.winnerAddress.substr(0, 6)}
                      ...
                      {item.winnerAddress.substr(
                        item.winnerAddress.length - 4,
                        item.winnerAddress.length
                      )}
                    </div>
                    <UncontrolledTooltip
                      placement="right"
                      target={`WinnerAddress-${item.round}`}
                    >
                      {item.winnerAddress}
                    </UncontrolledTooltip>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <GgLikedPagination
          pageSize={pageSize}
          totalItems={totalWinners}
          onChangePage={this.handlePageClick}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ winners, global }) => ({
  list: winners.list ? winners.list : [],
  totalWinners: winners.totalWinners,
  allTokens: global.allTokens,
  networkid: global.networkid
});
export default connect(mapStateToProps)(OldWinners);
