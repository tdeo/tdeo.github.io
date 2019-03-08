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
        {this.props.history.map((operation, i) => {
          return (
            <pre key={i}>
              {operation.a} {operation.op} {operation.b} = {operation.res}{'  '}
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