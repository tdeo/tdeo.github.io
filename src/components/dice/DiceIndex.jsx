import React from 'react';
import { Col, Grid, Row, Table } from 'react-bootstrap';

import DiceForm from './DiceForm.jsx';
import Roll from './Roll.jsx';
import RollHistory from './RollHistory.jsx';
import RollStats from './RollStats.jsx';

export default class DiceIndex extends React.Component {
  state = {
    dices: [{
      sides: 6,
      rolls: [],
    }],
    sides: 6,
  };

  constructor(props) {
    super(props);
    this.addDice = this.addDice.bind(this);
    this.deleteDice = this.deleteDice.bind(this);
    this.roll = this.roll.bind(this);
  }

  resetRolls() {
    let dices = this.state.dices;
    for (let dice of dices) {
      dice.rolls = [];
    }
    this.setState({ dices: dices });
  }

  roll() {
    for (let dice of this.state.dices) {
      dice.rolls.unshift(1 + Math.floor(Math.random() * dice.sides));
    }
    this.setState({ dices: this.state.dices });
  }

  addDice(sides) {
    this.state.dices.push({ sides: sides });
    this.resetRolls();
    this.setState({ dices: this.state.dices });
  }

  deleteDice(idx) {
    this.state.dices.splice(idx, 1);
    this.resetRolls();
    this.setState({ dices: this.state.dices });
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col sm={12}>
            <h1>Dice</h1>
            Dice simulator, contains statistics to check for bias.
          </Col>
        </Row>
        <br />
        <Row>
          <Col sm={12}>
            <DiceForm {...this.state} deleteDice={this.deleteDice} addDice={this.addDice}/>
          </Col>
        </Row>
        <br />
        <Row>
          <Col sm={6} md={4}>
            <Table condensed className="text-center" style={{ width: 'initial' }}>
              <Roll dices={this.state.dices} roll={this.roll} />
              <RollHistory dices={this.state.dices} />
            </Table>
          </Col>
          <Col sm={6} md={8}>
            <RollStats dices={this.state.dices} />
          </Col>
        </Row>
      </Grid>
    );
  }
}
