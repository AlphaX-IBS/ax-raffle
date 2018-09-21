import React, { PureComponent } from "react";
import { injectIntl } from "react-intl";

class Home extends PureComponent {
  render() {
    const { intl } = this.props;
    return (
      <div>
        <section id="home">
          <div className="row">
            <div className="col-md-5">
              <h1>GLOBAL BLOCKCHAIN RAFFLES GAME</h1>
              <p>Win big daily - Play Now!</p>
              <div className="text-center">
                <button type="button" className="btn btn-primary-home">
                  Play now!
                </button>
              </div>
            </div>
            <div className="col-md-2">
              <img
                style={{ maxHeight: "300px" }}
                src="/img/home-current-pot.png"
                alt=""
              />
            </div>
            <div className="col-md-5">
              <img
                style={{ maxHeight: "350px" }}
                src="/img/home-raffles-game.png"
                alt=""
              />
            </div>
          </div>
        </section>
        <section id="raffles">
          <div className="row text-center">
            <div className="col-md-12">
              <img
                className="home-img-countdown"
                src="img/home-count-down.png"
                alt=""
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <img
                style={{ maxHeight: "250px", paddingLeft: "50px" }}
                src="/img/raffles-img.png"
                alt=""
              />
            </div>
            <div className="col-md-6">
              <p>Crypto Raffles Lottery</p>
              <h3>International Decentralized lottery powered by Blockchain</h3>
              <p>
                <img
                  className="raffle-img-right"
                  src="img/raffles-advantages.png"
                  alt=""
                />
                <img
                  className="raffle-img-right"
                  src="img/raffles-fair.png"
                  alt=""
                />
                <img
                  className="raffle-img-right"
                  src="img/raffles-purchase.png"
                  alt=""
                />
              </p>
              <button type="button" className="btn-blue">
                Join now!
              </button>
              <button type="button" className="btn-red">
                Results
              </button>
            </div>
          </div>
        </section>
        <section id="playnow">
          <div className="row">
            <div
              style={{ paddingTop: "30px", paddingBottom: "20px" }}
              className="col"
            >
              <h3 className="text-center">Play now as easy as 1,2,3</h3>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="raffle-card text-center">
                <img
                  className="raffle-card-img-top"
                  src="img/how-it-work-step1.png"
                  alt="Ethereum"
                />
                <div className="raffle-card-body">
                  <h3>Send Ethereum to this smart contract address:</h3>
                  <p className="raffle-card-text">
                    0xdac15794f0fadfdcf3a93aeaabdc7cac19066724
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="raffle-card text-center">
                <img
                  className="raffle-card-img-top"
                  src="img/how-it-work-step2.png"
                  alt="Ethereum"
                />
                <div className="raffle-card-body">
                  <h3>Send Ethereum to this smart contract address:</h3>
                  <p className="raffle-card-text">
                    0xdac15794f0fadfdcf3a93aeaabdc7cac19066724
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="raffle-card text-center">
                <img
                  className="raffle-card-img-top"
                  src="img/how-it-work-step3.png"
                  alt="Ethereum"
                />
                <div className="raffle-card-body">
                  <h3>Send Ethereum to this smart contract address:</h3>
                  <p className="raffle-card-text">
                    0xdac15794f0fadfdcf3a93aeaabdc7cac19066724
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="crypto-raffles">
          <div className="row">
            <div
              className="col-md-6"
              style={{ paddingLeft: "80px", paddingTop: "50px" }}
            >
              <h3>What is Crypto Raffles?</h3>
              <p>
                Crypto Raffles is the world first truly fair raffle game. You
                can win big easily and fairly. quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit .
              </p>
              <button type="button" className="btn-red">
                Join now!
              </button>
              <button type="button" className="btn-blue">
                Results
              </button>
            </div>
            <div className="col-md-6">
              <img
                style={{ maxHeight: "300px", paddingTop: "50px" }}
                src="img/what-is-crypto-raffles-img.png"
                alt="Crypto Raffles"
              />
            </div>
          </div>
        </section>
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
                <li
                  className="list-group-item"
                  style={{ whiteSpace: "nowrap" }}
                >
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
      </div>
    );
  }
}

export default injectIntl(Home, { withRef: true });
