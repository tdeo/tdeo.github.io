import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Row, Col, Table} from 'react-bootstrap';

import DiceForm from './DiceForm.jsx';
import Roll from './Roll.jsx';
import RollHistory from './RollHistory.jsx';

export default class DiceIndex extends React.Component {
  static defaultProps = {
      dices: [{
        sides: 6,
        rolls: [],
      }],
      sides: 6,
  };

  static propTypes = {
    sides: PropTypes.number,
    dices: PropTypes.arrayOf(PropTypes.shape({
      sides: PropTypes.number,
      rolls: PropTypes.arrayOf(PropTypes.number),
    })),
  };

  constructor(props) {
    super(props);
    this.state = props;
    this.addDice = this.addDice.bind(this);
    this.deleteDice = this.deleteDice.bind(this);
    this.roll = this.roll.bind(this);
  }

  resetRolls() {
    this.props.dices.forEach((dice) => {
      dice.rolls = [];
    })
  }

  roll() {
    this.props.dices.forEach((dice) => {
      dice.rolls.unshift(1 + Math.floor(Math.random() * dice.sides));
    });
    this.setState(this.props.dices);
  }

  addDice(props) {
    this.props.dices.push({ sides: parseInt(props.sides, 10) });
    this.resetRolls();
    this.setState({ dices: this.props.dices });
  }

  deleteDice(idx) {
    this.props.dices.splice(idx, 1);
    this.resetRolls();
    this.setState({ dices: this.props.dices });
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col sm={12}>
            <h1>Dice</h1>
            Dice simulator, will contains statistics to check for bias.
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
          <Col sm={12}>
            <Table condensed className="text-center" style={{ width: "initial" }}>
              <Roll dices={this.state.dices} roll={this.roll} />
              <RollHistory dices={this.state.dices} />
            </Table>
          </Col>
        </Row>
      </Grid>
    );
  }
}
