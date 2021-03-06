import React from 'react';
import { Col, Grid, Row, Table } from 'react-bootstrap';

import DiceForm from './DiceForm';
import Roll from './Roll';
import RollHistory from './RollHistory';
import RollStats from './RollStats';

export default class DiceIndex extends React.Component {
  state = {
    dices: [{
      sides: 6,
      rolls: [],
    }],
    sides: 6,
  };

  resetRolls() {
    let dices = this.state.dices;
    for (let i = 0; i < dices.length; i++) {
      dices[i].rolls = [];
    }
    this.setState({ dices: dices });
  }

  roll = () => {
    let dices = this.state.dices;
    for (let i = 0; i < dices.length; i++) {
      dices[i].rolls.unshift(1 + Math.floor(Math.random() * dices[i].sides));
    }
    this.setState({ dices: this.state.dices });
  }

  addDice = (sides, color) => {
    this.state.dices.push({ sides, color });
    this.resetRolls();
    this.setState({ dices: this.state.dices });
  }

  deleteDice = (idx) => {
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
