import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Row, Col} from 'react-bootstrap';

import DiceForm from './DiceForm.jsx';

export default class Dice extends React.Component {
  static defaultProps = {
      dices: [{sides: 6}],
      sides: 6,
  };

  static propTypes = {
    sides: PropTypes.number,
    dices: PropTypes.arrayOf(PropTypes.shape({
      sides: PropTypes.number,
    })),
  };

  constructor(props) {
    super(props);
    this.state = {
      sides: (this.props.dices.length === 0) ? 6 : this.props.dices.slice(-1)[0].sides,
      dices: this.props.dices
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.deleteDice = this.deleteDice.bind(this);
  }

  onSubmit(props) {
    this.setState({ dices: this.props.dices.push({ sides: props.sides }) });
  }

  deleteDice(idx) {
    var dices = this.props.dices.splice(idx, 1);
    this.setState({ dices: dices });
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col>
            <h1>Dice</h1>
            Dice simulator, will contains statistics to check for bias.
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <DiceForm {...this.state} deleteDice={this.deleteDice} onSubmit={this.onSubmit}/>
          </Col>
        </Row>
        <br />
        <Row>

        </Row>
      </Grid>
    );
  }
}
