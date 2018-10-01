import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class AwardTag extends PureComponent {
  render() {
    const { value, symbol } = this.props;
    return (
      <div className="container">
        <div className="headline">Current Pot</div>
        <div>
          <span className="symbol">{symbol}</span>
          <span className="prize">{Intl.NumberFormat().format(value)}</span>
        </div>
      </div>
    );
  }
}

const defaultProps = {
  value: 0,
  symbol: ""
};
AwardTag.defaultProps = defaultProps;

const propTypes = {
  value: PropTypes.any.isRequired,
  symbol: PropTypes.string
};
AwardTag.propTypes = propTypes;

export default AwardTag;
