import React from 'react';
import PropTypes from 'prop-types';
import { Col, ControlLabel, Form, FormGroup } from 'react-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import PlaceResult from './PlaceResult.jsx';

export default class PlaceForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      multiple: false,
      isLoading: false,
      options: [],
    };
  }

  selectPlace(places) {
    var place = places[0];
    if (place === undefined) {
      return;
    }
    (new window.google.maps.Geocoder()).geocode(
      { placeId: place.place_id },
      (result) => {
        var res = result[0];
        this.props.onSubmit({
          north: res.geometry.viewport.getNorthEast().lat(),
          east: res.geometry.viewport.getNorthEast().lng(),
          south: res.geometry.viewport.getSouthWest().lat(),
          west: res.geometry.viewport.getSouthWest().lng(),
        });
      }
    );
  }

  handleSearch(query) {
    this.setState({ isLoading: true });
    (new window.google.maps.places.AutocompleteService()).getPlacePredictions(
      { input: query, types: ['geocode'] },
      (places) => {
        var res = places.map((p) => {
          return { place_id: p.place_id, desc: p.description };
        });
        this.setState({ isLoading: false, options: res });
      }
    );
  }

  render() {
    return (
      <Form horizontal>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={3}>
            <ControlLabel>Search place</ControlLabel>
          </Col>
          <Col sm={6}>
            <AsyncTypeahead
              {...this.state}
              minLength={3}
              delay={200}
              filterBy={() => {
                return true;
              }}
              labelKey={'desc'}
              onSearch={this.handleSearch.bind(this)}
              onChange={this.selectPlace.bind(this)}
              placeholder="Search for a place..."
              renderMenuItemChildren={(option) => {
                return (
                  <PlaceResult key={option.place_id} place={option} />
                );
              }}
            />
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

