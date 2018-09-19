import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';

export default class Competence extends React.Component {
  static propTypes = {
    percent: PropTypes.number,
    desc: PropTypes.string,
  };

  render() {
    var angle = Math.round((360 * this.props.percent / 100) - 90);
    const id = Math.floor(1000000000 * Math.random());

    return (
      <Col xs={4} style={{ paddingRight: '5px', paddingLeft: '5px' }}>
        <style type="text/css">{`
          #outer_${id} {
            -webkit-print-color-adjust: exact;
            background-image: linear-gradient(90deg, transparent 49%, green 49%), linear-gradient(${angle}deg, #ccc 49%, green 49%) !important;
            border-radius: 100%;
            margin: 0 auto 5px auto;
            min-height: 2em;
            min-width: 2em;
            padding: 5px;
            width: fit-content;
          }
          #inner_${id} {
            -webkit-print-color-adjust: exact;
            background-color: white !important;
            border-radius: 100%;
            height: 20px;
            width: 20px;
          }`}</style>

        <div id={`outer_${id}`}>
          <div id={`inner_${id}`}>&nbsp;</div>
        </div>
        <div style={{ margin: 'auto', width: 'fit-content', textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: this.props.desc }} />
      </Col>
    );
  }
}
