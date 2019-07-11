import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToolbar } from 'react-bootstrap';

export default class NumbersForm extends React.Component {
  static propTypes = {
    numbers: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.number,
      active: PropTypes.boolean
    })),
    ops: PropTypes.arrayOf(PropTypes.shape({
      op: PropTypes.string,
      active: PropTypes.boolean
    })),
    toggleNumber: PropTypes.func,
    toggleOp: PropTypes.func,
  };

  render() {
    return (
      <div>
        <ButtonToolbar>
          {this.props.numbers.map((number, i) => {
            return (
              <Button key={i} onClick={this.props.toggleNumber} value={i} bsStyle={number.active ? 'warning' : 'default'}>
                {number.value}
              </Button>
            );
          })}
          {this.props.ops.map((op, i) => {
            return (
              <Button key={i} onClick={this.props.toggleOp} bsStyle={op.active ? 'warning' : 'info' } value={i}>
                {op.op}
              </Button>
            );
          })}
        </ButtonToolbar>
      </div>
    );
  }
}
