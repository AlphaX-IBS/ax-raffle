import React, { PureComponent } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookSquare,
  faTwitterSquare,
  faGooglePlusSquare
} from "@fortawesome/free-brands-svg-icons";

library.add(faFacebookSquare, faTwitterSquare, faGooglePlusSquare);

const facebookIcon = <FontAwesomeIcon icon={faFacebookSquare} size="2x" />;
const twitterIcon = <FontAwesomeIcon icon={faTwitterSquare} size="2x" />;
const googlePlusIcon = <FontAwesomeIcon icon={faGooglePlusSquare} size="2x" />;

class RaffleFooter extends PureComponent {
  render() {
    return (
      <footer id="footer">
        <div className="row wow fadeIn" data-wow-delay="0.5s">
          <div className="col-md-3 col-sm-6 text-center">
            <img
              style={{ paddingBottom: "20px" }}
              src="img/logo-white.png"
              alt="logo white"
            />
            <p className="text-md-left">
              Global Blockchain Raffle Games Win big daily – Play Now!
            </p>
            <a href="#footer">{facebookIcon}</a>
            <a href="#footer">{twitterIcon}</a>
            <a href="#footer">{googlePlusIcon}</a>
          </div>
          <div className="col-md-2 col-sm-6 ">
            <h3 className="text-center">Info</h3>
            <ul className="list-group text-md-left">
              <li className="list-group-item">Term and conditions</li>
              <li className="list-group-item">Privacy</li>
              <li className="list-group-item" style={{ whiteSpace: "nowrap" }}>
                info@crypto-raffles.com
              </li>
            </ul>
          </div>
          <div className="col-12 d-block d-lg-none d-md-none" style={{minHeight:"70px"}}></div>
          <div className="col-md-4 col-sm-6 ">
            <h3 className="text-center">Useful links</h3>
            <div className="row justify-content-center">
              <div className="col-xs-6">
                <ul className="list-group text-md-left">
                  <li className="list-group-item">Home</li>
                  <li className="list-group-item">Raffles</li>
                  <li className="list-group-item">How it works?</li>
                  <li className="list-group-item">Resultes & info</li>
                </ul>
              </div>
              <div className="col-xs-6">
                <ul className="list-group text-md-left">
                  <li className="list-group-item">Play online</li>
                  <li className="list-group-item">Winners & stories</li>
                  <li className="list-group-item">Statistic</li>
                  <li className="list-group-item">Contact</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 text-center">
            <h3 className="text-md-left">newsletter</h3>
            <form>
              <div className="form-group text-md-left">
                <label htmlFor="exampleInputEmail1">Email address</label>
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
