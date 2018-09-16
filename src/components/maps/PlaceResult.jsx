import React from 'react';
import PropTypes from 'prop-types';

export default class PlaceResult extends React.Component {
  static propTypes = {
    place: PropTypes.shape({
      desc: PropTypes.string,
    }),
  };

  render() {
    return (
      <div>
        {this.props.place.desc}
      </div>
    );
  }
}
