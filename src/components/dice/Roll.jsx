import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import Dice from './Dice.jsx';

export default class Roll extends React.Component {
  static propTypes = {
    roll: PropTypes.func,
    dices: PropTypes.arrayOf(PropTypes.shape({
      sides: PropTypes.number,
      lastRoll: PropTypes.number,
    })),
  }

  constructor(props) {
    super(props);
    this.state = {
      dices: this.props.dices,
    };
    this.roll = this.roll.bind(this);
  }

  randomValues() {
    return this.state.dices.map((dice) => {
      return 1 + Math.floor(Math.random() * dice.sides);
    });
  }

  roll() {
    this.setState({ blocked: true });
    this.props.roll();
    setTimeout(() => {
      this.setState({ blocked: false })
    }, 300);
  }

  render() {
    return (
      <thead>
        <tr>
          {this.state.dices.map((dice, i) => {
            return (
              <td key={`${dice.sides},${i}`}>
                <Dice val={dice.rolls.length > 0 ? dice.rolls[0] : "?"} />
              </td>
            );
          })}
          <td>
            <Button bsStyle="primary" onClick={this.roll} disabled={this.state.blocked}>
              Roll!
            </Button>
          </td>
        </tr>
      </thead>
    );
  }
}
