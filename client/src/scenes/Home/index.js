import React, { PureComponent } from "react";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import JackPotCountDown from "../../components/JackPotCountDown";
// import AwardTag from "../../components/AwardTag";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import Loader from "react-loader-spinner";
import CountUp from "react-countup";

class Home extends PureComponent {
  goToPlayNow = () => {
    const { history } = this.props;
    history.push("/play");
  };

  render() {
    const {
      openedTime,
      closedTime,
      totalPot,
      contractAddress,
      gamestatus,
      globalStatus
    } = this.props;

    let isLoading = false;
    if (globalStatus === "init") {
      isLoading = true;
    }

    const prize = isLoading ? (
      <h3 className="text-center">
        <Loader type="Rings" color="#226226" height={32} width={32} />
      </h3>
    ) : (
      <h3 className="text-center neon-light">
        <FontAwesomeIcon icon={faEthereum} />
        <CountUp
          start={0}
          end={Number(totalPot)}
          duration={2.75}
          decimals={3}
          decimal="."
          prefix=" "
          // onEnd={() => console.log('Ended! 👏')}
          // onStart={() => console.log('Started! 💨')}
        />
      </h3>
    );

    let targetTime = 0;
    let countDownMsg = "";
    if (!isLoading) {
      switch (gamestatus) {
        case "starting":
          countDownMsg = "Next Pot Starts In";
          targetTime = openedTime;
          break;
        case "opening":
          countDownMsg = "Next Draw Remaining Time";
          targetTime = closedTime;
          break;
        case "drawing":
          countDownMsg = "Picking A Winner";
          break;
        default:
      }
    }

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
                {prize}
                {/* <FontAwesomeIcon icon={faEthereum} /> <AwardTag value={totalPot}/> */}
              </div>
            </div>
            {/* show only on mobile */}
            <div
              className="col pt-60 text-center d-block d-sm-none xs-currentpot wow fadeIn"
              data-wow-delay="1s"
            >
              <p style={{ marginBottom: 0 }}>Current pot:</p>
              {prize}
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
                <JackPotCountDown msg={countDownMsg} target={targetTime} />
              </div>
            </div>
          </div>
          <div className="row pt-5 pb-5">
            <div className="col-md-5 wow fadeInLeft">
              <img
                className="img-fluid md-pl-50"
                src="/img/raffles-img.png"
                alt=""
              />
            </div>
            <div className="col-md-7 wow fadeInRight">
              <p>Crypto Raffles Lottery</p>
              <h3>
                The first international decentralized lottery powered by
                Blockchain
              </h3>
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
              <p>
                Each player has the highest chance to win the jackpot opened
                automatically everyday. Players can easily buy tickets by their
                Ethereum or supported ERC20 tokens without any internal deposit.
                Just only one winner will get whole ETH and ERC20 tokens in pot
                excluded operator fee.
              </p>
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
          <div className="row pt-3 pb-5">
            <div className="col-md-4 wow fadeInLeft">
              <div className="raffle-card text-center">
                <img
                  className="raffle-card-img-top"
                  src="img/how-it-work-step1.png"
                  alt="Ethereum"
                />
                <div className="raffle-card-body">
                  <h4>Step 1</h4>
                  <p className="raffle-card-text">
                    Buy tickets by ETH or our supported ERC20 tokens{" "}
                    <Link to="/play">here</Link>
                  </p>
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
                  <h4>Step 2
                  </h4>
                  <p className="raffle-card-text">
                    After buying tickets successfully, please check your tickets{" "}
                    <Link to="/play">here</Link>
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
                  <h4>Step 3
                  </h4>
                  <p className="raffle-card-text">
                    After closing pot, drawing ticket will be processed to
                    randomly select one winning ticket, then please check the
                    details of winner list <Link to="/play">here</Link>
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
          <div className="row pt-3 pb-3">
            <div className="col-md-7 md-pl-80 pt-50 wow fadeInLeft">
              <h3>What is Crypto Raffles?</h3>
              <p>
                Crypto raffle is the world truly fair raffle game based on the
                blokchain, where you can buy tickets by crypto currencies and
                win the pot prize with our daily draw. It’s decentralized
                application totally for easy joining and winning ETH and ERC20
                tokens without any required deposit. Smart contract is the main
                actor for global and automatic game execution. All transaction
                data is stored on blockchain transparently and immutably. The
                official raffle smart contract address on Ethereum network here:
                <br />
                <a href={`https://etherscan.io/address/${contractAddress}`}>{contractAddress}</a>
              </p>
            </div>
            <div className="col-md-5 wow fadeInRight">
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
  openedTime: global.potOpenedTimestamp,
  closedTime: global.potClosedTimestamp,
  totalPot: global.totalPot,
  gamestatus: global.gamestatus,
  globalStatus: global.status,
  contractAddress: api.contract ? api.contract.address : "..."
});

export default withRouter(
  injectIntl(connect(mapStateToProps)(Home), {
    withRef: true
  })
);
