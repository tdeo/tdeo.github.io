import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import './Dice.css'

export default class Dice extends React.Component {
  static propTypes = {
    val: PropTypes.node,
    value: PropTypes.node,
    onClick: PropTypes.func,
  }

  render() {
    return (
      <Button className="dice" onClick={this.props.onClick} value={this.props.value}>
        {this.props.val}
      </Button>
    );
  }
}
