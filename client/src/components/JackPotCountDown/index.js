import React, { PureComponent } from "react";
import { getRemainingTimeFromDaysToSeconds } from "../../utils/time";

function fixedZero(val) {
  if (
    val === undefined ||
    isNaN(val) ||
    Object.prototype.toString.call(val) === "[object String]"
  ) {
    return "-";
  }
  return val * 1 < 10 ? `0${val}` : val;
}

class JackPotCountDown extends PureComponent {
  timer = 0;

  interval = 1000;

  constructor(props) {
    super(props);

    const { lastTime } = this.initTime(props);

    this.state = {
      lastTime
    };
  }

  componentDidMount() {
    this.tick();
  }

  componentWillReceiveProps(nextProps) {
    const { target } = this.props;
    if (target !== nextProps.target) {
      clearTimeout(this.timer);
      const { lastTime } = this.initTime(nextProps);
      this.setState(
        {
          lastTime
        },
        () => {
          this.tick();
        }
      );
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  initTime = props => {
    let lastTime = 0;
    let targetTime = 0;
    if (props.target === undefined) {
      return lastTime;
    }
    // console.log(`target=${props.target}`);
    try {
      if (Object.prototype.toString.call(props.target) === "[object Date]") {
        targetTime = props.target.getTime();
      } else {
        targetTime = new Date(props.target).getTime();
      }
    } catch (e) {
      throw new Error("invalid target prop", e);
    }

    lastTime = targetTime - new Date().getTime();
    return {
      lastTime: lastTime < 0 ? 0 : lastTime
    };
  };

  // defaultFormat = time => (
  //  <span>{moment(time).format('hh:mm:ss')}</span>
  // );
  defaultFormat = time => {
    const timeLeft = getRemainingTimeFromDaysToSeconds(Math.floor(time / 1000));
    return (
      <div className="clockdiv">
        <div>
          <span>{fixedZero(timeLeft.days)}</span>
          <div className="smalltext">Days</div>
        </div>
        <div className="digit-separator">
          <span>|</span>
          <div className="smalltext">&nbsp;</div>
        </div>
        <div>
          <span>{fixedZero(timeLeft.hours)}</span>
          <div className="smalltext">Hours</div>
        </div>
        <div className="digit-separator">
          <span>:</span>
          <div className="smalltext">&nbsp;</div>
        </div>
        <div>
          <span>{fixedZero(timeLeft.minutes)}</span>
          <div className="smalltext">Minutes</div>
        </div>
        <div className="digit-separator">
          <span>:</span>
          <div className="smalltext">&nbsp;</div>
        </div>
        <div>
          <span>{fixedZero(timeLeft.seconds)}</span>
          <div className="smalltext">Seconds</div>
        </div>
      </div>
    );
  };

  tick = () => {
    const { onEnd } = this.props;
    let { lastTime } = this.state;

    this.timer = setTimeout(() => {
      if (lastTime < this.interval) {
        clearTimeout(this.timer);
        this.setState(
          {
            lastTime: 0
          },
          () => {
            if (onEnd) {
              onEnd();
            }
          }
        );
      } else {
        lastTime -= this.interval;
        this.setState(
          {
            lastTime
          },
          () => {
            this.tick();
          }
        );
      }
    }, this.interval);
  };

  render() {
    const { format = this.defaultFormat, onEnd, msg, ...rest } = this.props;
    const { lastTime } = this.state;
    const result = format(lastTime);

    return (
      <div className="pot-count-down">
        <div className="headline">{msg}</div>
        <div {...rest}>{result}</div>
      </div>
    );
  }
}

export default JackPotCountDown;
