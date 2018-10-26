import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Blockies from "react-blockies";
import { withRouter } from "react-router";

class TopBar extends PureComponent {
  handleConnect = () => {
    // history is available thru `withRouter`
    const { dispatch, history } = this.props;
    const currentPath = history.location.pathname
    if (currentPath === '/play') {
      dispatch({ type: "PL_TOGGLE_MODAL" });
    } else {
      // go to player scene
      history.push("/play");
    }
    
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
          <span className="align-middle d-none d-md-block logged-in-address">
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
  account: player.account
});

// withRouter to track History of routes
export default withRouter(
  connect(mapStateToProps)(TopBar)
);
