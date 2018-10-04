import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Blockies from "react-blockies";

class TopBar extends PureComponent {
  handleConnect = () => {
    const { dispatch } = this.props;
    dispatch({ type: "PL_JOIN_REQUESTED", payload: {} });
  };

  render() {
    const { account } = this.props;

    let avatar = (
      <button
        type="button"
        className="btn btn-red"
        onClick={this.handleConnect}
      >
        Connect
      </button>
    );
    if (account) {
      avatar = (
        <div className="logged-in">
          <span className="align-middle">
            Logged in as: {account.substring(0, 6)}
            ...
            {account.substring(account.length - 4)}
          </span>
          <Blockies
            className="align-middle"
            seed={account}
            size={6}
            scale={8}
            color="#ff753b"
            bgColor="#2b6cc4"
            spotColor="#1dacd6"
          />
        </div>
      );
    }

    return <div>{avatar}</div>;
  }
}

const mapStateToProps = ({ player }) => ({
  account: player.accounts.length > 0 ? player.accounts[0] : undefined
});

export default connect(mapStateToProps)(TopBar);
