import React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';

import Canvas from './Canvas.jsx';
import CoordinatesForm from './CoordinatesForm.jsx';
import PlaceForm from './PlaceForm.jsx';
import Utils from './Utils.jsx';

export default class Maps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      south: 52.360052,
      north: 52.382052,
      west: 4.877190,
      east: 4.916190,
      zoom: 15,
      images: [],
      valid: true,
    };
  }

  onSubmit(props) {
    this.setState(Utils.computeImages(props));
  }

  render() {
    return (
      <div className="maps">
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
              <PlaceForm onSubmit={this.onSubmit.bind(this)} />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <CoordinatesForm {...this.state} changeState={this.setState.bind(this)} onSubmit={this.onSubmit.bind(this)} />
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
