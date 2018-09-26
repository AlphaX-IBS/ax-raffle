import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Blockies from "react-blockies";
import { NavLink } from "react-router-dom";

class TopBar extends PureComponent {
  handleConnect = () => {
    const { dispatch } = this.props;
    dispatch({ type: "WEB3_FETCH_REQUESTED", payload: {} });
  };

  render() {
    const { account } = this.props;
    console.log("account=" + account);

    let avatar = (
      <button
        type="button"
        className="btn btn-primary-home"
        onClick={this.handleConnect}
      >
        Connect
      </button>
    );
    if (account) {
      avatar = (
        <Blockies
          seed={account}
          size={10}
          scale={3}
          color="#dfe"
          bgColor="#dedede"
          spotColor="#abc"
        />
      );
    }

    return (
      <div className="row">
        <div className="col-md-8">
          <NavLink className="navbar-brand" to="/">
            <img src="img/logo.png" alt="" />
          </NavLink>
        </div>
        <div className="col-md-4">{avatar}</div>
      </div>
    );
  }
}

const mapStateToProps = ({ player }) => ({
  account: player.accounts.length > 0 ? player.accounts[0] : undefined
});

export default connect(mapStateToProps)(TopBar);
