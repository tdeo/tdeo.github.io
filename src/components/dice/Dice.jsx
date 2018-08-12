import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

import DiceForm from './DiceForm.jsx';

export default class Dice extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col>
            <h1>Dice</h1>
            Dice simulator, contains statistics to check for bias.
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <DiceForm />
          </Col>
        </Row>
      </Grid>
    );
  }
}
