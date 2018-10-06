import React, { PureComponent } from "react";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import JackPotCountDown from "../../components/JackPotCountDown";
// import AwardTag from "../../components/AwardTag";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";

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
            <div className="col-md-4 wow fadeInLeft">
              <h1 className="md-pl-50 pt-50">GLOBAL BLOCKCHAIN RAFFLES GAME</h1>
              <p className="md-pl-50">Win big daily - Play Now!</p>
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
            {/* hide on mobile */}
            <div className="col-md-4 award d-none d-sm-block wow fadeInUp">
              <img
                className="img-fluid"
                style={{ maxWidth: "180px" }}
                src="/img/bare-home-current-pot.png"
                alt=""
              />
              <div className="centered">
                <p style={{ marginBottom: 0 }}>Current pot:</p>
                <h3 className="text-center">
                  <FontAwesomeIcon icon={faEthereum} /> {totalPot}
                </h3>
                {/* <FontAwesomeIcon icon={faEthereum} /> <AwardTag value={totalPot}/> */}
              </div>
            </div>
            {/* show only on mobile */}
            <div
              className="col pt-60 text-center d-block d-sm-none xs-currentpot wow fadeIn"
              data-wow-delay="1s"
            >
              <p style={{ marginBottom: 0 }}>Current pot:</p>
              <h3 className="text-center">
                <FontAwesomeIcon icon={faEthereum} /> {totalPot}
              </h3>
            </div>
            <div className="col-md-4 col-sm-6 wow fadeInRight">
              <img
                className="img-fluid md-pt-50"
                src="/img/home-raffles-game.png"
                alt=""
              />
            </div>
          </div>
        </section>
        {/* Raffles Section include the countdown */}
        <section id="raffles">
          {/* countdown here */}
          <div className="row text-center wow fadeIn" data-wow-delay="1s">
            <div className="col-md-12 xsnopadding">
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
            <div className="col-md-6 wow fadeInLeft">
              <img
                className="img-fluid md-pl-50"
                src="/img/raffles-img.png"
                alt=""
              />
            </div>
            <div className="col-md-6 wow fadeInRight">
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
                className="btn-red"
                onClick={this.goToPlayNow}
              >
                Join now!
              </button>
              <button
                type="button"
                className="btn-blue"
                onClick={this.goToPlayNow}
              >
                Results
              </button>
            </div>
          </div>
          <div
            className="col-12 d-block d-lg-none d-md-none d-sm-none"
            style={{ minHeight: "50px" }}
          />
        </section>
        {/* section how to play */}
        <section id="playnow">
          <div className="row">
            <div
              style={{ paddingTop: "30px", paddingBottom: "20px" }}
              className="col"
            >
              <h3 className="text-center wow fadeInDown">
                Play now as easy as 1,2,3
              </h3>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 wow fadeInLeft">
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
            <div className="col-md-4 wow fadeInUp">
              <div className="raffle-card text-center">
                <img
                  className="raffle-card-img-top"
                  src="img/how-it-work-step2.png"
                  alt="Ethereum"
                />
                <div className="raffle-card-body">
                  <h4>Each Ethereum gives you 1000 raffle tickets</h4>
                  <p className="raffle-card-text">
                    check your ticket numbers <Link to="/play">here</Link>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 wow fadeInRight">
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
        {/* section what is raffles? */}
        <section id="crypto-raffles">
          <div className="row">
            <div className="col-md-6 md-pl-80 pt-50 wow fadeInLeft">
              <h3>What is Crypto Raffles?</h3>
              <p>
                Crypto Raffles is the world first truly fair raffle game. You
                can win big easily and fairly. quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit .
              </p>
              <button
                type="button"
                className="btn-red"
                onClick={this.goToPlayNow}
              >
                Join now!
              </button>
              <button
                type="button"
                className="btn-blue"
                onClick={this.goToPlayNow}
              >
                Results
              </button>
            </div>
            <div className="col-md-6 wow fadeInRight">
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

const mapStateToProps = ({ api, global }) => ({
  closedTime: global.potClosedTimestamp,
  totalPot: global.totalPot,
  contractAddress: api.contract ? api.contract.address : "..."
});

export default withRouter(
  injectIntl(connect(mapStateToProps)(Home), {
    withRef: true
  })
);
