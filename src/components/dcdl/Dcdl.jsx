import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

export default class Dcdl extends React.Component {
  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col sm={12}>
              <h1>Des chiffres et des lettres</h1>
            </Col>
            <br />
            <Col sm={12}>
              <a className="btn btn-primary" href="/dcdl/chiffres">
                  Chiffres
              </a>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
