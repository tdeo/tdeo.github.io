import React from 'react';
import { Grid, ButtonToolbar, Button, Row, Col } from 'react-bootstrap';

export default class Roll extends React.Component {
  state = { blocked: {} };

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentRoll.length === 0) {
      this.setState({ blocked: {} });
    }
  }

  render() {
    const { currentRoll, currentPlayer, me, wsClient, players } = this.props;

    let cur = players.find(e => e.id === currentPlayer);

    if (players.every(p => Object.keys(p.score).length >= 14)) {
      return <Grid>
        <Row>
          <Col xs={12}>
            La partie est finie !
          </Col>
        </Row>
      </Grid>;
    }

    if (!currentPlayer) {
      return <Grid>
        <Row>
          <Col xs={12}>
            Joueurs connectés : {players.filter(p => p.id).map(p => p.name).join(', ')}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            On attend encore des joueurs pour commencer.
          </Col>
        </Row>
      </Grid>;
    }

    return <Grid>
      <Row>
        <Col xs={12}>
          Joueurs connectés : {players.filter(p => p.id).map(p => p.name).join(', ')}
        </Col>
      </Row>
      <Row>
        {(currentPlayer !== me) && <Col xs={12}>
          {cur.name} est en train de jouer :
        </Col>}
        {currentRoll.map((rolls, i) => <Col key={i} xs={12}>
          <ButtonToolbar>
            {rolls.map((r, j) => <Button key={j}
              className={this.state.blocked[j] ? 'dice dice-blocked' : 'dice'}
              disabled={i !== currentRoll.length - 1}
              onClick={() => this.setState({
                blocked: {
                  ...this.state.blocked,
                  [j]: !this.state.blocked[j],
                }
              })}>
              {r.value}
            </Button>)}
          </ButtonToolbar>
        </Col>)}
        <Col xs={12}>
          {(currentRoll.length < 3) && (currentPlayer === me) && <Button onClick={() => wsClient.send(
            JSON.stringify({ type: 'roll', blocked: this.state.blocked })
          )}>Lancer</Button>}
        </Col>
      </Row>
    </Grid>;
  }
}
