import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';

import Utils from './Utils.jsx';

const floatRe = RegExp('^\\s*\\-?\\d+(.\\d*)?\\s*$');

export default class CoordinatesForm extends React.Component {
  static propTypes = {
    south: PropTypes.number,
    north: PropTypes.number,
    west: PropTypes.number,
    east: PropTypes.number,
    zoom: PropTypes.number,
    onSubmit: PropTypes.func,
    changeState: PropTypes.func,
    valid: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  getValidationState(ids) {
    var _this = this;
    if (ids.every(function(id) {
      return _this.props[id] === '';
    })) {
      return null;
    }
    if (ids.find(function(id) {
      return !floatRe.test(_this.props[id]);
    })) {
      return 'error';
    }
    return 'success';
  }

  checkValid() {
    // There are browser limitations on Canvas sizes, we're going to check that
    // so that the thing doesn't crash.
    // See https://stackoverflow.com/questions/6081483/maximum-size-of-a-canvas-element
    // This is going to enable / disable the submit button.
    var images = Utils.computeImages(this.props);
    if ((images.width > 16383) || (images.height > 16383) || (images.width * images.height > 8192 * 8192)) {
      this.props.changeState({ valid: false });
    } else {
      this.props.changeState({ valid: true });
    }
  }

  handleChange(event) {
    var value = (event.target.id === 'zoom') ? parseInt(event.target.value, 10) : parseFloat(event.target.value);
    this.props.changeState(
      { [event.target.id]: value },
      this.checkValid.bind(this),
    );
  }

  handleSubmit(event) {
    this.props.onSubmit(this.props);
    event.preventDefault();
  }

  render() {
    return (
      <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
        <FormGroup validationState={this.getValidationState(['south', 'north'])}>
          <Col componentClass={ControlLabel} sm={3}>
            <ControlLabel>Latitude</ControlLabel>
          </Col>
          <Col sm={3}>
            <FormControl
              id="south"
              type="text"
              value={this.props.south}
              placeholder="South latitude"
              onChange={this.handleChange}
            />
          </Col>
          <Col sm={3}>
            <FormControl
              id="north"
              type="text"
              value={this.props.north}
              placeholder="North latitude"
              onChange={this.handleChange}
            />
          </Col>
        </FormGroup>

        <FormGroup validationState={this.getValidationState(['west', 'east'])}>
          <Col componentClass={ControlLabel} sm={3}>
            <ControlLabel>Longitude</ControlLabel>
          </Col>
          <Col sm={3}>
            <FormControl
              id="west"
              type="text"
              value={this.props.west}
              placeholder="West longitude"
              onChange={this.handleChange}
            />
          </Col>
          <Col sm={3}>
            <FormControl
              id="east"
              type="text"
              value={this.props.east}
              placeholder="East longitude"
              onChange={this.handleChange}
            />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col componentClass={ControlLabel} sm={3}>
            <ControlLabel>Detail level</ControlLabel>
          </Col>
          <Col sm={3}>
            <FormControl
              id="zoom"
              type="number"
              min="1"
              max="21"
              value={this.props.zoom}
              placeholder="Detail level"
              onChange={this.handleChange}
            />
          </Col>
          <Col sm={3}>
            <Button bsStyle="primary" type="submit" style={{ width: '100%' }}
              disabled={!this.props.valid}>
              Submit
            </Button>
          </Col>
        </FormGroup>

        {this.props.valid || <FormGroup id="canvas-size-alert">
          <Col sm={7} smOffset={2}>
            <HelpBlock className="alert alert-danger">
              The image you&apos;re trying to generate is too big and is going to crash the browser, please lower detail level value.
            </HelpBlock>
          </Col>
        </FormGroup>}
      </Form>
    );
  }
}
