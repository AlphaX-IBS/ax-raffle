import React, { Component } from "react";
import { Table } from "reactstrap";

class OwnerTicketList extends Component {
  render() {
    return (
      <div>
        <Table className="table-striped table-light table-bordered">
          <thead className="thead-light">
            <tr>
              <th>Round</th>
              <th>Ticket ID</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>12341231234</td>
            </tr>
            <tr>
              <th scope="row">1</th>
              <td>54674564334</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>34563456366</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

export default OwnerTicketList;
