import React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';

import Canvas from './Canvas.jsx';
import CoordinatesForm from './CoordinatesForm.jsx';
import Utils from './Utils.jsx';

export default class Maps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: []
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(props) {
    this.setState(Utils.computeImages(props));
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col sm={12}>
              <h1>Google Maps HD</h1>
              This combines together a number of Google Maps images to generate a (very) high resolution image
              of a portion of the Earth.
            </Col>
          </Row>
          <br />
          <Row>
            <Col sm={12}>
              <CoordinatesForm onSubmit={this.onSubmit}/>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <Canvas {...this.state} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
