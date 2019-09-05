import React from 'react';
import { Table, Button } from 'react-bootstrap';

export default class Score extends React.Component {
  numbersTotal = (player) => {
    return [1,2,3,4,5,6].reduce((acc, i) => (acc + (player.score[i] || 0)), 0);
  }

  numbersBonus = (player) => {
    return (this.numbersTotal(player) >= 63) ? 35 : null;
  }

  numbersGrandTotal = (player) => {
    return (this.numbersTotal(player) + (this.numbersBonus(player) || 0));
  }

  downTotal = (player) => {
    return ['brelan', 'carre', 'full', 'pSuite', 'gSuite', 'yahtzee', 'chance'].reduce((acc, i) => acc + (player.score[i] || 0), 0);
  }

  grandTotal = (player) => {
    return this.downTotal(player) + this.numbersGrandTotal(player) + (player.score['pYahtzee'] || 0);
  }

  scoreFor = (cat) => {
    let roll = this.props.currentRoll[this.props.currentRoll.length - 1];
    if (!roll) {
      return;
    }

    roll = roll.map(r => r.value);
    let h = {};
    for (let i = 0; i < roll.length; i++) {
      if (!h[roll[i]]) {
        h[roll[i]] = 0;
      }
      h[roll[i]] += 1;
    }
    h = Object.values(h);


    if (cat === 'pYahtzee') {
      return h.includes(5) ? 100 : 0;
    } else if (cat === 'chance') {
      return roll.reduce((acc, i) => acc + i, 0);
    } else if (cat === 'yahtzee') {
      return h.includes(5) ? 50 : 0;
    } else if (cat === 'gSuite') {
      return (roll.includes(2) && roll.includes(3) && roll.includes(4) && roll.includes(5) && roll.includes(6)) ? 40 : 0;
    } else if (cat === 'pSuite') {
      return (roll.includes(2) && roll.includes(3) && roll.includes(4) && roll.includes(5) && roll.includes(1)) ? 30 : 0;
    } else if (cat === 'full') {
      if (h.includes(2) && h.includes(3)) {
        return 25;
      } else if (h.includes(5)) {
        return 25;
      }
      return 0;
    } else if (cat === 'carre') {
      return (h.includes(4) || h.includes(5)) ? roll.reduce((acc, i) => acc + i, 0) : 0;
    } else if (cat === 'brelan') {
      return (h.includes(3) || h.includes(4) || h.includes(5)) ? roll.reduce((acc, i) => acc + i, 0) : 0;
    } else {
      return roll.reduce((acc, i) => acc += (i === cat ? i : 0), 0);
    }
  }

  cell = (i, cat) => {
    let player = this.props.players[i];
    const { currentPlayer, me, wsClient } = this.props;

    const played = Object.keys(player.score).length;

    if ((player.score[cat] === undefined) &&
        (player.id === me) &&
        (currentPlayer === me) &&
        played < 13) {
      return <td key={i}>
        <Button className="set-score" onClick={() => wsClient.send(
          JSON.stringify({
            type: 'score',
            cat: cat,
            score: this.scoreFor(cat),
          }))}>
          {this.scoreFor(cat)}
        </Button>
      </td>;
    } else {
      return <td key={i}>{player.score[cat]}</td>;
    }
  }

  lastCell = (i, cat = 'pYahtzee') => {
    let player = this.props.players[i];
    const { currentPlayer, me, wsClient } = this.props;

    const played = Object.keys(player.score).length;

    if ((player.score[cat] === undefined) &&
        (player.id === me) &&
        (currentPlayer === me) &&
        played === 13) {
      return <td key={i}>
        <Button className="set-score" onClick={() => wsClient.send(
          JSON.stringify({
            type: 'score',
            cat: cat,
            score: this.scoreFor(cat),
          }))}>
          {this.scoreFor(cat)}
        </Button>
      </td>;
    } else {
      return <td key={i}>{player.score[cat]}</td>;
    }
  }

  render() {
    const { players } = this.props;

    return <Table striped bordered condensed>
      <thead>
        <tr>
          <th />
          {players.map((p, i) => <th key={i}>{p.name}</th>)}
        </tr>
      </thead>
      <tbody>
        {[1,2,3,4,5,6].map(i => <tr key={i}>
          <td className="right">Total des <b>{i}</b></td>
          {players.map((p, j) => this.cell(j, i))}
        </tr>)}
        <tr>
          <td className="right"><b>Total</b></td>
          {players.map((p, i) => <td key={i}>{this.numbersTotal(p)}</td>)}
        </tr>
        <tr>
          <td className="right">63+ : Bonus - <b>35</b></td>
          {players.map((p, i) => <td key={i}>{this.numbersBonus(p)}</td>)}
        </tr>
        <tr>
          <td className="right"><b>Total</b></td>
          {players.map((p, i) => <td key={i}>{this.numbersGrandTotal(p)}</td>)}
        </tr>
      </tbody>

      <tbody>
        <tr style={{ backgroundColor: 'initial' }}>
          <td style={{ border: 'none' }} />
        </tr>
      </tbody>

      <tbody>
        <tr>
          <td className="right">Brelan - <b>Total des 5 dés</b></td>
          {players.map((p, i) => this.cell(i, 'brelan'))}
        </tr>
        <tr>
          <td className="right">Carré - <b>Total des 5 dés</b></td>
          {players.map((p, i) => this.cell(i, 'carre'))}
        </tr>
        <tr>
          <td className="right">Full - <b>25</b></td>
          {players.map((p, i) => this.cell(i, 'full'))}
        </tr>
        <tr>
          <td className="right">Petite Suite - <b>30</b></td>
          {players.map((p, i) => this.cell(i, 'pSuite'))}
        </tr>
        <tr>
          <td className="right">Grande Suite - <b>40</b></td>
          {players.map((p, i) => this.cell(i, 'gSuite'))}
        </tr>
        <tr>
          <td className="right">Yahtzee - <b>50</b></td>
          {players.map((p, i) => this.cell(i, 'yahtzee'))}
        </tr>
        <tr>
          <td className="right">Chance - <b>Total des 5 dés</b></td>
          {players.map((p, i) => this.cell(i, 'chance'))}
        </tr>
        <tr>
          <td className="right"><b>Total</b></td>
          {players.map((p, i) => <td key={i}>{this.downTotal(p)}</td>)}
        </tr>
      </tbody>

      <tbody>
        <tr style={{ backgroundColor: 'initial' }}>
          <td style={{ border: 'none' }} />
        </tr>
      </tbody>

      <tbody>
        <tr>
          <td className="right">Prime Yahtzee - <b>100</b></td>
          {players.map((p, i) => this.lastCell(i, 'pYahtzee'))}
        </tr>
      </tbody>

      <tbody>
        <tr style={{ backgroundColor: 'initial' }}>
          <td style={{ border: 'none' }} />
        </tr>
      </tbody>

      <tbody>
        <tr>
          <td className="right"><b>Total</b></td>
          {players.map((p, i) => <td key={i}>{this.grandTotal(p)}</td>)}
        </tr>
      </tbody>
    </Table>;
  }
}
