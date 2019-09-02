import React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import Connect from './Connect';
import Roll from './Roll';
import Score from './Score';

import './yahtzee.css';

export default class Yahtzee extends React.Component {
  state = {};

  componentDidMount() {
    this.wsClient = new W3CWebSocket('wss://yahtzeee.herokuapp.com');

    this.wsClient.onerror = console.warn;

    this.wsClient.onmessage = (message) => {
      this.setState(JSON.parse(message.data));
    };
    this.wsClient.onclose = () => {
      window.location.reload();
    };
  }

  addPlayer = (name) => {
    let player = { name, score: {} };
    this.setState({ players: this.state.players + [player] });
  }

  render() {
    if (!this.state.me) {
      return <Grid>
        <Connect wsClient={this.wsClient} {...this.state}/>
      </Grid>;
    }

    return <Grid>
      <Row>
        <Col sm={12} md={6}>
          <Roll wsClient={this.wsClient} {...this.state} />
        </Col>

        <Col sm={12} md={6}>
          <Score wsClient={this.wsClient} {...this.state} />
        </Col>
      </Row>
    </Grid>;
  }
}
