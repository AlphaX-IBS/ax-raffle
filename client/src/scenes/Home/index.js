import React, { PureComponent } from "react";
import { injectIntl } from "react-intl";
import JackPotCountDown from "../../components/JackPotCountDown";
import AwardTag from "../../components/AwardTag";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class Home extends PureComponent {
  goToPlayNow = () => {
    const { history } = this.props;
    history.push("/play");
  };

  render() {
    const { closedTime, totalPot, contractAddress } = this.props;

    return (
      <div>
        <section id="home">
          <div className="row">
            <div className="col-md-5">
              <h1>GLOBAL BLOCKCHAIN RAFFLES GAME</h1>
              <p>Win big daily - Play Now!</p>
              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-primary-home"
                  onClick={this.goToPlayNow}
                >
                  Play now!
                </button>
              </div>
            </div>
            <div className="col-md-2 col-sm-6 award">
              <img
                style={{ maxHeight: "300px" }}
                src="/img/bare-home-current-pot.png"
                alt=""
              />
              <div className="centered">
                <AwardTag value={totalPot} symbol="&#x29eb;" />
              </div>
            </div>
            <div className="col-md-5 col-sm-6">
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
                alt=""
                src="/img/bare-home-count-down.png"
              />
              <div className="centered">
                <JackPotCountDown target={closedTime} />
              </div>
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
              <button
                type="button"
                className="btn-blue"
                onClick={this.goToPlayNow}
              >
                Join now!
              </button>
              <button type="button" className="btn-red">
                Results
              </button>
            </div>
          </div>
          <div
            className="col-12 d-block d-lg-none d-md-none d-sm-none"
            style={{ minHeight: "50px" }}
          />
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
                  <h4>Send Ethereum to this smart contract address:</h4>
                  <p className="raffle-card-text">{contractAddress}</p>
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
                  <h4>Each Ethereum gives you 1000 raffle tickets</h4>
                  <p className="raffle-card-text">
                    check your ticket numbers <a href="/play">here</a>
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
                  <h4>Every day at 0:00 GMT.</h4>
                  <p className="raffle-card-text">
                    The smart contract will randomly select one winning ticket.
                    The address that owns this ticket will wins the whole pot!
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-12 d-block d-lg-none d-md-none d-sm-none"
            style={{ minHeight: "50px" }}
          />
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
          <div
            className="col-12 d-block d-lg-none d-md-none d-sm-none"
            style={{ minHeight: "50px" }}
          />
        </section>
      </div>
    );
  }
}

const defaultProps = {
  totalPot: 0,
  closedTime: 0,
  contractAddress: "..."
};
Home.defaultProps = defaultProps;

const mapStateToProps = ({ api, pot }) => ({
  closedTime: pot.potClosedTimestamp,
  totalPot: pot.totalPot,
  contractAddress: api.contract ? api.contract.address : "..."
});

export default withRouter(
  injectIntl(connect(mapStateToProps)(Home), {
    withRef: true
  })
);
