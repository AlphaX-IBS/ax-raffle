import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Table, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import GgLikedPagination from "./../../../../components/GgLikedPagination/index";

class RoundTicketList extends PureComponent {
  state = {
    pageSize: 2,
    page: 1,
    items: []
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

  componentWillReceiveProps(nextProps) {
    const { items } = this.state;
    const { tickets } = nextProps;
    const { total } = tickets;
    if (total !== items.length) {
      const items = [...Array(total).keys()].map(i => ({
        id: i + 1,
        name: "Item " + (i + 1)
      }));
      this.setState({ items });
    }
  }

  handlePageClick = item => {
    const { pageSize } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: "TICKET_FETCH_REQUESTED",
      payload: {
        pageSize,
        page: item.id
      }
    });
    this.setState({ page: item.id });
  };

  render() {
    const { pageSize, page, items } = this.state;
    const { tickets } = this.props;
    const { list, totalTicketCount, total } = tickets;

    const startIndex = pageSize * Math.max(0, page - 1);
    const data = list.slice(startIndex, pageSize);

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
              <tr>
                <th scope="row">{item.sum}</th>
                <td>{item.sum / totalTicketCount}</td>
                <td>
                  {item.address.substr(0, 6)}
                  ...
                  {item.address.substr(
                    item.address.length - 4,
                    item.address.length
                  )}
                </td>
                <td>{item.sum / 1000}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <GgLikedPagination
          pageSize={3}
          items={items}
          onChangePage={this.handlePageClick}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ tickets }) => ({
  tickets
});
export default connect(mapStateToProps)(RoundTicketList);
