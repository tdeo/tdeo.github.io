import React from 'react';
import * as Bs from 'react-bootstrap';

export default class Connect extends React.Component {
  state = { name: '' };

  changeName = (e) => {
    this.setState({ name: e.target.value });
  };

  render() {
    const { wsClient, players } = this.props;

    if (!players) {
      return <div>Waiting for connection...</div>;
    }

    return <Bs.Row>
      <Bs.Col xs={12}>
        Partie en cours :
        {' '}
        {players.map(p => `${p.name} (${Object.values(p.score).length} tours joués)`).join(', ')}
      </Bs.Col>
      <Bs.Col xs={12}>
        Je suis :
        <Bs.ButtonToolbar>
          {players.map((p, i) => <Bs.Button key={i}
            disabled={p.id}
            onClick={() => wsClient.send(
              JSON.stringify({ type: 'player', idx: i })
            )}>
            {p.name}
          </Bs.Button>)}
        </Bs.ButtonToolbar>
        <br />
        Rejoindre la partie en tant que :
        <Bs.Form inline>
          <Bs.InputGroup>
            <Bs.FormControl type="text" placeholder="Toto"
              value={this.state.name} onChange={this.changeName} />
            <Bs.InputGroup.Button>
              <Bs.Button type="submit" onClick={(e) => {
                e.preventDefault();
                wsClient.send(
                  JSON.stringify({ type: 'newPlayer', name: this.state.name })
                );
                return false;
              }}>Rejoindre</Bs.Button>
            </Bs.InputGroup.Button>
          </Bs.InputGroup>
        </Bs.Form>
        <br />
        <Bs.ButtonToolbar>
          <Bs.Button onClick={() => wsClient.send(
            JSON.stringify({ type: 'reset' })
          )}>
            Recommencer une partie
          </Bs.Button>
        </Bs.ButtonToolbar>
      </Bs.Col>
    </Bs.Row>;
  }
}
