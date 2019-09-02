import React from 'react';
import { Row, Col, ButtonToolbar, Button } from 'react-bootstrap';

export default class Connect extends React.Component {
  render() {
    if (!this.props.players) {
      return <div>Waiting for connection...</div>;
    }

    return <Row>
      <Col xs={12}>
        {'Partie en cours : '}
        {this.props.players.map(p => `${p.name} (${Object.values(p.score).length} tours joués)`).join(', ')}
      </Col>
      <Col xs={12}>
        Je suis :
        <ButtonToolbar>
          {this.props.players.map((p, i) => <Button key={i}
            onClick={() => this.props.wsClient.send(
              JSON.stringify({ type: 'player', idx: i })
            )}>
            {p.name}
          </Button>)}
        </ButtonToolbar>
        <br />
        <ButtonToolbar>
          <Button onClick={() => this.props.wsClient.send(
            JSON.stringify({ type: 'reset' })
          )}>
            Recommencer une partie
          </Button>
        </ButtonToolbar>
      </Col>
    </Row>;
  }
}
