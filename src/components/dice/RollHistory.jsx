import React from 'react';

export default class RollHistory extends React.Component {
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
      </tbody>
    );
  }
}
