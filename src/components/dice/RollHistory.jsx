import React from 'react';
import PropTypes from 'prop-types';

export default class RollHistory extends React.Component {
  static propTypes = {
    dices: PropTypes.arrayOf(PropTypes.shape({
      sides: PropTypes.number,
      rolls: PropTypes.arrayOf(PropTypes.number),
    })),
  }

  constructor(props) {
    super(props);
    this.state = {
      dices: this.props.dices,
    };
  }

  render() {
    return (
      <tbody>
        {this.state.dices[0].rolls.map((_, i) => {
          if (i === 0 || i > 10) { return null; }
          return (
            <tr key={i}>
              {this.state.dices.map((dice, j) => {
                return (
                  <td key={`${i},${j}`}>
                    {dice.rolls[i]}
                  </td>
                );
              })}
            </tr>
          );
        })}

        {(this.state.dices[0].rolls.length > 10) &&
          <tr>
            {this.state.dices.map((dice, j) => {
              return (
                <td key={`...,${j}`}>
                  ...
                </td>
              );
            })}
          </tr>
        }
      </tbody>
    );
  }
}
