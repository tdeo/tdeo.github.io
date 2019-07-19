import React from 'react';
import PropTypes from 'prop-types';

export default class Time extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    initial: PropTypes.number,
  };

  render() {
    var ratio = this.props.value / this.props.initial;
    var color = 'green';
    if (ratio < 0.15) {
      color = 'red';
    } else if (ratio < 0.3) {
      color = 'orange';
    }
    ratio = Math.max(0, Math.min(1, ratio));
    var i = (1 - ratio) * 360;
    i = Math.max(0, Math.min(360, i));

    if (!this.props.value) {
      return null;
    }

    return (
      <div style={{
        borderRadius: '100%',
        width: 'fit-content',
        marginTop: '20px',
        padding: '5px',
        backgroundImage: (i <= 180) ?
          `linear-gradient(${90 + i}deg, transparent 50%, ${color} 50%),linear-gradient(90deg, ${color} 50%, transparent 50%)` :
          `linear-gradient(${i - 90}deg, transparent 50%, #fff 50%),linear-gradient(90deg, ${color} 50%, transparent 50%)`,
      }}>
        <h2 style={{
          color: color,
          padding: '10px',
          margin: 0,
          textAlign: 'center',
          verticalAlign: 'middle',
          minWidth: '1.8em',
          minHeight: '1em',
          borderRadius: '100%',
          backgroundColor: '#fff',
          width: 'fit-content' }}>
          {Math.ceil(this.props.value)}
        </h2>
      </div>
    );
  }
}
