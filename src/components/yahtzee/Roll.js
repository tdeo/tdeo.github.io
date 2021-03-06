import React from 'react';
import { Grid, ButtonToolbar, Button, Row, Col } from 'react-bootstrap';

export default class Roll extends React.Component {
  state = { blocked: {} };

  static getDerivedStateFromProps(props) {
    if (props.currentRoll.length === 0) {
      return { blocked: {} };
    } else {
      return null;
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

    if (this.rollCount !== currentRoll.length) {
      this.prevBlock = Object.assign({}, this.state.blocked);
      this.rollCount = currentRoll.length;
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
              className={'dice ' +
                (!this.prevBlock[j] &&
                 (i === this.rollCount - 1) ? 'dice-roll ' : '') +
                (r.blocked || (this.state.blocked[j] && (i === this.rollCount - 1))
                  ? 'dice-blocked' : '')}
              disabled={i !== currentRoll.length - 1}
              onClick={() => (currentPlayer === me) && this.setState({
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
          {(currentRoll.length < 3) && (currentPlayer === me) && <Button
            onClick={() => wsClient.send(
              JSON.stringify({ type: 'roll', blocked: this.state.blocked })
            )}
            style={{ marginButton: 20 }}>Lancer</Button>}
        </Col>
      </Row>
    </Grid>;
  }
}
