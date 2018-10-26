import React from 'react';
import PropTypes from 'prop-types';
import { Layer, Rect, Line, Text } from 'react-konva';

import Utils from './Utils.jsx';

export default class Scale extends React.Component {
  static propTypes = {
    south: PropTypes.number,
    east: PropTypes.number,
    west: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
  };

  findScale() {
    // Get the maximum scale below 500 pixels or 20% of page
    var scales = [
      ['50m', 0.05],
      ['100m', 0.1],
      ['200m', 0.2],
      ['500m', 0.5],
      ['1km', 1],
      ['2km', 2],
      ['5km', 5],
      ['10km', 10],
      ['20km', 20],
      ['50km', 50],
      ['100km', 100],
      ['200km', 200],
      ['500km', 500],
    ];
    var i = 0;
    var target_width = Math.max(500, 0.2 * this.props.width);
    while ((i < scales.length - 1) && (Utils.distance(this.props.south, this.props.west, this.props.east) * target_width / this.props.width > scales[i][1])) {
      i += 1;
    }
    return {
      width: this.props.width * scales[i][1] / Utils.distance(this.props.south, this.props.west, this.props.east),
      text: scales[i][0],
    };
  }

  render() {
    var scale = this.findScale();
    var h = this.props.height;
    var w = scale.width;

    return (
      <Layer>
        <Rect x={0} y={h - 50} width={w + 100} height={50} opacity={0.5} fill='white' />
        <Line points={[10,h - 40,  10,h - 10,  w + 10,h - 10,  w + 10,h - 40]} strokeWidth={3} stroke='black' />
        <Text x={w + 20} y={h - 40} fontSize={30} text={scale.text} />
      </Layer>
    );
  }
}
