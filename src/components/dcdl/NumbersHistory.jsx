import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

export default class NumbersHistory extends React.Component {
  static propTypes = {
    history: PropTypes.arrayOf(PropTypes.shape({
      a: PropTypes.number,
      b: PropTypes.number,
      op: PropTypes.string,
      res: PropTypes.number,
    })),
    cancelLast: PropTypes.func,
    success: PropTypes.bool,
  };

  render() {
    return (
      <div>
        {this.props.history.map((op, i) => {
          return (
            <pre key={i}>
              {Math.max(op.i, op.j)} {op.op} {Math.min(op.i, op.j)} = {op.res}{'  '}
              { (i === 0 && !this.props.success) &&
                <Button bsStyle="danger" onClick={this.props.cancelLast}>
                  Cancel
                </Button>
              }
            </pre>
          );
        })}
      </div>
    );
  }
}
