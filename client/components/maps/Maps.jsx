import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col>
              <h1>Google Maps HD</h1>
              This combines together a number of Google Maps images to generate a (very) high resolution image
              of a portion of the Earth.
            </Col>
          </Row>
          <Row>
          </Row>
        </Grid>
      </div>
    );
  }
}
