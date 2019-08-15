import React from 'react';
import PropTypes from 'prop-types';
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default class RollStats extends React.Component {
  static propTypes = {
    dices: PropTypes.arrayOf(PropTypes.shape({
      sides: PropTypes.number,
      lastRoll: PropTypes.number,
    })),
  }

  constructor(props) {
    super(props);
    this.state = { dices: this.props.dices };
  }

  graphData() {
    var real = this.real();
    var expected = this.expected(this.state.dices);
    var data = [];
    for (var val in expected) {
      data.push({
        value: val,
        real: real[val] || 0,
        expected: expected[val],
      });
    }
    return data;
  }

  expected(dices) {
    if (dices.length === 0) {
      return { 0: 1 };
    }
    var firstDiceSides = dices[0].sides;
    var result = {};
    var expectedRest = this.expected(dices.slice(1));
    for (var val in expectedRest) {
      val = parseInt(val, 10);
      for (var first = 1; first <= firstDiceSides; first++) {
        if (result[first + val] === undefined) {
          result[first + val] = 0;
        }
        result[first + val] += expectedRest[val] / firstDiceSides;
      }
    }
    return result;
  }

  real() {
    var result = {};
    var total = 0;
    if (this.state.dices.length === 0) {
      return result;
    }
    this.state.dices[0].rolls.forEach((_, i) => {
      total++;
      var value = 0;
      this.state.dices.forEach((dice) => {
        value += dice.rolls[i];
      });
      result[value] |= 0;
      result[value]++;
    });
    for (var val in result) {
      result[val] /= total;
    }
    return result;
  }

  render() {
    const graphData = this.graphData();
    return (
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={graphData} width={500} height={300}>
          <CartesianGrid />
          <XAxis dataKey="value" label={{ value: 'Dice sum', position: 'insideBottomRight', dy: 10 }}/>
          <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft', dx: 0, dy: 30 }}/>
          <Tooltip formatter={(value) => {
            var rounded_rate = Math.round(1000 * value) / 1000;
            return `${rounded_rate} (${Math.round(this.state.dices[0].rolls.length * rounded_rate)} rolls)`;
          }}/>
          <Legend />
          <Bar dataKey="real" fill='#33b1ff' />
          <Line type="monotone" dataKey="expected" stroke='#ff7300'/>
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
}
