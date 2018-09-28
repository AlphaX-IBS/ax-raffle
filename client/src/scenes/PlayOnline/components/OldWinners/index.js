import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Table, UncontrolledTooltip } from "reactstrap";
import GgLikedPagination from "./../../../../components/GgLikedPagination/index";
import moment from "moment";

class OldWinners extends PureComponent {
  state = {
    pageSize: 2,
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
    const { list, totalWinners } = this.props;

    const startIndex = pageSize * Math.max(0, page - 1);
    const data = list.slice(startIndex, startIndex + pageSize);

    return (
      <div>
        <Table className="table-striped table-light table-bordered">
          <thead className="thead-light">
            <tr>
              <th>Round</th>
              <th>Prize</th>
              <th>Nick Name</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.round}>
                <th scope="row">{item.round}</th>
                <td>{item.totalPot}</td>
                <td>
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
                </td>
                <td>
                  {moment(item.potEndedTimestamp).format(
                    "YYYY-MM-DD hh:mm:ssZ"
                  )}
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

const mapStateToProps = ({ winners }) => ({
  list: winners.list ? winners.list : [],
  totalWinners: winners.totalWinners
});
export default connect(mapStateToProps)(OldWinners);
