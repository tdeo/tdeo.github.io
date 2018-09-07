import React from 'react';
import PropTypes from 'prop-types';
import { Layer, Stage } from 'react-konva';

import './Canvas.css';
import MapTile from './MapTile.jsx';

export default class Canvas extends React.Component {
  static defaultProps = {
    width: 0,
    height: 0,
    images: [],
  };

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    images: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      src: PropTypes.string,
      x: PropTypes.number,
      y: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number,
      crop: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.number,
      })
    })),
  };

  render() {
    return (
      <Stage
        width={this.props.width}
        height={this.props.height} >
        <Layer>
          {this.props.images.map((image) =>
            <MapTile key={image.key} {...image}/>
          )}
        </Layer>
      </Stage>
    );
  }
}
