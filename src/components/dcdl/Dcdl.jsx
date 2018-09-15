import React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';

export default class Dcdl extends React.Component {
  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col sm={12}>
              <h1>Des chiffres et des lettres</h1>
            </Col>
            <Col sm={12}>
              This is a french TV game (
              <a href="https://en.wikipedia.org/wiki/Des_chiffres_et_des_lettres" target="_blank" rel="noopener noreferrer">wikipedia</a>
              ) in which two candidates play against each other to solve either word or numbers challenges.
              This is a single-player game simulator for it.
              <br />
              <br />
              Play with:{' '}
              <a className="btn btn-primary" href="/dcdl/numbers">
                  Numbers
              </a>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
