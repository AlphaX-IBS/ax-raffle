import React, { PureComponent } from "react";

class RaffleFooter extends PureComponent {
  render() {
    return (
      <footer id="footer">
        <div className="row">
          <div className="col-md-3 text-center">
            <img
              style={{ paddingBottom: "20px" }}
              src="img/logo-white.png"
              alt="logo white"
            />
            <p className="text-left">
              Global Blockchain Raffle Games Win big daily – Play Now!
            </p>
            <a href="#footer">
              <i className="fa fa-facebook-square fa-2x" />
            </a>
            <a href="#footer">
              <i className="fa fa-twitter fa-2x" />
            </a>
            <a href="#footer">
              <i className="fa fa-google-plus fa-2x" />
            </a>
          </div>
          <div className="col-md-2">
            <h3 className="text-center">Info</h3>
            <ul className="list-group">
              <li className="list-group-item">Term and conditions</li>
              <li className="list-group-item">Privacy</li>
              <li className="list-group-item" style={{ whiteSpace: "nowrap" }}>
                info@crypto-raffles.com
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h3 className="text-center">Useful links</h3>
            <div className="row">
              <div className="col-md-6">
                <ul className="list-group">
                  <li className="list-group-item">Home</li>
                  <li className="list-group-item">Raffles</li>
                  <li className="list-group-item">How it works?</li>
                  <li className="list-group-item">Resultes & info</li>
                </ul>
              </div>
              <div className="col-md-6">
                <ul className="list-group">
                  <li className="list-group-item">Play online</li>
                  <li className="list-group-item">Winners & stories</li>
                  <li className="list-group-item">Statistic</li>
                  <li className="list-group-item">Contact</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <h3 className="text-left">newsletter</h3>
            <form>
              <div className="form-group">
                <label for="exampleInputEmail1">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                />
                <small id="emailHelp" className="form-text text-muted">
                  We'll never share your email with anyone else.
                </small>
              </div>
              <button type="submit" className="btn-red">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="row">
          <p
            style={{
              width: "100%",
              borderTop: "1px solid #aaa",
              marginTop: "10px",
              paddingTop: "10px"
            }}
            className="text-center"
          >
            Crypto Raffles © 2017 All rights reserved
          </p>
        </div>
      </footer>
    );
  }
}

export default RaffleFooter;
