import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToolbar } from 'react-bootstrap';

export default class ChiffresForm extends React.Component {
  static propTypes = {
    numbers: PropTypes.arrayOf({
      value: PropTypes.number,
      active: PropTypes.boolean
    }),
    ops: PropTypes.arrayOf({
      op: PropTypes.number,
      active: PropTypes.boolean
    }),
    toggleNumber: PropTypes.function,
    toggleOp: PropTypes.function,
  };

  constructor(props) {
    super(props);
    this.state = props;
  }

  render() {
    return(
      <div>
        <ButtonToolbar>
          {this.props.numbers.map((number, i) => {
            return (
              <Button key={i} onClick={this.props.toggleNumber} value={i} active={number.active}>
                {number.value}
              </Button>
            );
          })}
          {this.props.ops.map((op, i) => {
            return (
              <Button key={i} onClick={this.props.toggleOp} bsStyle="info" value={i} active={op.active}>
                {op.op}
              </Button>
            );
          })}
        </ButtonToolbar>
      </div>
    );
  }
}
