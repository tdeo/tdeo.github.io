import React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import Chat from './Chat';
import Connect from './Connect';
import Roll from './Roll';
import Score from './Score';

import './yahtzee.css';

const WS_URL = (window.location.hostname === 'localhost')
  ? 'ws://localhost:8000'
  : 'wss://yahtzeee.herokuapp.com';

export default class Yahtzee extends React.Component {
  state = {};

  componentDidMount() {
    this.wsClient = new W3CWebSocket(WS_URL);

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
    if (!this.state.me || this.state.players.length === 0) {
      return <Grid>
        <Connect wsClient={this.wsClient} {...this.state}/>
      </Grid>;
    }

    return <Grid>
      <Row>
        <Col xs={12} sm={6} smPush={6} md={3} mdPush={3}>
          <Chat wsClient={this.wsClient} {...this.state} />
        </Col>

        <Col xs={12} sm={6} smPull={6} md={3} mdPull={3}>
          <Roll wsClient={this.wsClient} {...this.state} />
        </Col>

        <Col xs={12} md={6}>
          <Score wsClient={this.wsClient} {...this.state} />
        </Col>
      </Row>
    </Grid>;
  }
}
