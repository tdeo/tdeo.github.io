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
    const { currentRoll, currentPlayer, me, wsClient } = this.props;

    let cur = this.props.players.find(e => e.id === currentPlayer);

    return <Grid>
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
              {r}
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
