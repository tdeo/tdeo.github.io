import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form, Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

const floatRe = RegExp('^\\s*\\d+(.\\d*)?\\s*$');

export default class CoordinatesForm extends React.Component {
  static defaultProps = {
      south: 52.360052,
      north: 52.382052,
      west: 4.877190,
      east: 4.916190,
      zoom: 15,
  };

  static propTypes = {
    south: PropTypes.number,
    north: PropTypes.number,
    west: PropTypes.number,
    east: PropTypes.number,
    zoom: PropTypes.number,
    onSubmit: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = props;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getValidationState(ids) {
    var _this = this;
    if (ids.every(function(id) { return _this.state[id] == ""; })) {
      return null
    }
    if (ids.find(function(id) { return !floatRe.test(_this.state[id]); })) {
      return "error";
    }
    return "success"
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit(event) {
    this.props.onSubmit(this.state);
    event.preventDefault();
  }

  render() {
    return(
      <Form horizontal onSubmit={this.handleSubmit}>
        <FormGroup validationState={this.getValidationState(["south", "north"])}>
          <Col componentClass={ControlLabel} sm={3}>
            <ControlLabel>Latitude</ControlLabel>
          </Col>
          <Col sm={3}>
            <FormControl
              id="south"
              type="text"
              value={this.state.south}
              placeholder="South latitude"
              onChange={this.handleChange}
            />
          </Col>
          <Col sm={3}>
            <FormControl
              id="north"
              type="text"
              value={this.state.north}
              placeholder="North latitude"
              onChange={this.handleChange}
            />
          </Col>
        </FormGroup>

        <FormGroup validationState={this.getValidationState(["west", "east"])}>
          <Col componentClass={ControlLabel} sm={3}>
            <ControlLabel>Longitude</ControlLabel>
          </Col>
          <Col sm={3}>
            <FormControl
              id="west"
              type="text"
              value={this.state.west}
              placeholder="West longitude"
              onChange={this.handleChange}
            />
          </Col>
          <Col sm={3}>
            <FormControl
              id="east"
              type="text"
              value={this.state.east}
              placeholder="East longitude"
              onChange={this.handleChange}
            />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col componentClass={ControlLabel} sm={3}>
            <ControlLabel>Zoom</ControlLabel>
          </Col>
          <Col sm={3}>
            <FormControl
              id="zoom"
              type="number"
              min="1"
              max="21"
              value={this.state.zoom}
              placeholder="Zoom level"
              onChange={this.handleChange}
            />
          </Col>
          <Col sm={3}>
            <Button bsStyle="primary" type="submit" style={{width: "100%"}}>Submit</Button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
