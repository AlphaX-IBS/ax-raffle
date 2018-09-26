import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Home from "../scenes/Home";
import PlayOnline from "./../scenes/PlayOnline/index";
import Contact from "./../scenes/Contact/index";
import RaffleFooter from "../components/RaffleFooter";
import RaffleHeader from "../components/RaffleHeader";

class BasicLayout extends Component {
  render() {
    return (
      <div>
        <RaffleHeader />
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/play" component={PlayOnline} />
          <Route path="/contact" component={Contact} />
          <Redirect from="/" to="/home" />
        </Switch>
        <RaffleFooter />
      </div>
    );
  }
}

export default BasicLayout;
