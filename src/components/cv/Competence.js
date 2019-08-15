import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import { Layer, Stage, Arc, Ring } from 'react-konva';

export default class Competence extends React.Component {
  static propTypes = {
    percent: PropTypes.number,
    desc: PropTypes.string,
  };

  render() {
    var angle = Math.round((360 * this.props.percent / 100) - 90);

    return (
      <Col xs={4} className="text-center" style={{ paddingRight: 0, paddingLeft: 0 }}>
        <Stage style={{ margin: 'auto', width: 'fit-content' }} width={40} height={40}>
          <Layer>
            <Ring innerRadius={10} outerRadius={15} x={20} y={20} fill="#ccc" />
            <Arc angle={angle + 90} rotation={-90} innerRadius={10} outerRadius={15} x={20} y={20} fill="green"/>
          </Layer>
        </Stage>
        <div style={{ margin: 'auto', width: 'fit-content', textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: this.props.desc }} />
      </Col>
    );
  }
}
