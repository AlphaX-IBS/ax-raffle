import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Col, FormText, Input, InputGroup, Label } from "reactstrap";

class CostEstimation extends PureComponent {
  render() {
    const {
      gas,
      gasprice,
      onGasChange,
      onGasPriceChange,
      cost,
      className
    } = this.props;

    let costNode = <div />;
    if (cost) {
      costNode = (
        <InputGroup>
          <Label for="ticketcost" sm={4} className="text-right">
            {cost.label}
          </Label>
          <Col sm={8}>
            <Input
              id="ticketcost"
              disabled={true}
              className="text-left"
              placeholder={cost.value}
            />
          </Col>
        </InputGroup>
      );
    }

    return (
      <div className={className}>
        {costNode}
        <InputGroup className="pt-3">
          <Label for="gaslimit" sm={4} className="text-right">
            Gas Limit:
          </Label>
          <Col sm={8}>
            <Input
              id="gaslimit"
              disabled={true}
              className="text-left"
              placeholder="Gas Limit"
              type="number"
              min={21000}
              value={gas}
              onChange={onGasChange}
            />
            <FormText color="muted">
              Recommended gas limit is 700,000 gas. All unused gas is refunded
              to you at the end of a transaction.
            </FormText>
          </Col>
        </InputGroup>
        <InputGroup className="pt-3">
          <Label for="gasprice" sm={4} className="text-right">
            Gas Price (Gwei):
          </Label>
          <Col sm={8}>
            <Input
              id="gasprice"
              disabled={true}
              className="text-left"
              placeholder="Gas Price"
              type="number"
              step={0.1}
              min={2}
              value={gasprice}
              onChange={onGasPriceChange}
            />
            <FormText color="muted">
              Gas based on current network conditions. Recommended gas price is
              2Gwei.
            </FormText>
          </Col>
        </InputGroup>
      </div>
    );
  }
}

const defaultProps = {
  className: {},
  onGasChange: function() {},
  onGasPriceChange: function() {}
};
CostEstimation.defaultProps = defaultProps;

const propTypes = {
  className: PropTypes.object,
  onGasChange: PropTypes.func,
  onGasPriceChange: PropTypes.func,
  gas: PropTypes.number.isRequired,
  gasprice: PropTypes.number.isRequired,
  cost: PropTypes.object
};
CostEstimation.propTypes = propTypes;

export default CostEstimation;
