import React from 'react';
import {Grid, Row, Col, Button} from 'react-bootstrap';

import NumbersForm from './NumbersForm.jsx';
import NumbersHistory from './NumbersHistory.jsx';
import { Shortcuts } from 'react-shortcuts';

export default class Numbers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numbers: this.sortNumbers(this.randomNumbers()),
      target: this.randomTarget(),
      success: false,
      ops: this.defaultOps(),
      history: [],
    };
  }

  cancelLast() {
    if (this.state.history.length === 0) {
      return;
    }
    var history = this.state.history;
    var last = history.shift();
    var numbers = this.state.numbers;
    var i = numbers.findIndex((n) => { return (n.value === last.res); });
    numbers.splice(i, 1);
    numbers.push({ value: last.a, active: false });
    numbers.push({ value: last.b, active: false });
    this.setState({ numbers: this.sortNumbers(numbers), history: history });
  }

  toggleOp(event) {
    var idx = parseInt(event.target.value, 10);
    var ops = []
    this.state.ops.forEach((op, i) => {
      ops.push({
        op: op.op,
        active: i === idx ? !op.active : false,
      })
    });
    this.setState({ ops: ops }, this.submitOperation);
  }

  toggleNumber(event) {
    var idx = parseInt(event.target.value, 10);
    var numbers = []
    this.state.numbers.forEach((number, i) => {
      numbers.push({
        value: number.value,
        active: i === idx ? !number.active : number.active,
      })
    });
    this.setState({ numbers: numbers }, this.submitOperation);
  }

  submitOperation() {
    var activeOps = this.state.ops.filter(op => op.active);
    var activeNumbers = this.state.numbers.filter(num => num.active);
    if (activeOps.length !== 1 || activeNumbers.length !== 2) {
      return;
    }
    var op = activeOps[0].op;
    var a = Math.min(...activeNumbers.map(num => num.value));
    var b = Math.max(...activeNumbers.map(num => num.value));
    var newVal;

    if (op === '+') {
      newVal = a + b;
    } else if (op === '-') {
      newVal = b - a;
    } else if (op === '×') {
      newVal = a * b;
    } else if (op === '/') {
      if (b % a  === 0) {
        newVal = b / a;
      }
    }

    if (newVal === undefined) {
      return;
    }

    var newNumbers = [];
    this.state.numbers.forEach((num) => {
      if (!num.active) {
        newNumbers.push(num);
      }
    });
    newNumbers.push({ value: newVal, active: false });
    var history = this.state.history;
    history.unshift({
      a: a,
      b: b,
      op: op,
      res: newVal,
    })
    this.setState({
      numbers: this.sortNumbers(newNumbers),
      ops: this.defaultOps(),
      success: (newVal === this.state.target),
      history: history,
    });
  }

  defaultOps() {
    return [
      { op: '+', active: false },
      { op: '-', active: false },
      { op: '×', active: false },
      { op: '/', active: false },
    ];
  }

  sortNumbers(nums) {
    return nums.sort((a, b) => { return a.value - b.value; })
  }

  randomTarget() {
    return Math.floor(100 + 900 * Math.random());
  }

  randomNumbers() {
    var a = [1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10,25,50,75,100];
    var indexes = [];
    do {
      var r = Math.floor(a.length * Math.random());
      if (!indexes.includes(r)) {
        indexes.push(r);
      }
    } while (indexes.length < 6)
    var numbers = [];
    indexes.forEach(function(idx) {
      numbers.push({
        value: a[idx],
        active: false,
      });
    });
    return numbers;
  }

  _handleShortcuts(action) {
    if (action.match(/^number\d$/)) {
      this.toggleNumber({ target: { value: action.replace('number', '') }});
    } else if (action.match(/^op\d$/)) {
      this.toggleOp({ target: { value: action.replace('op', '') }});
    } else if (action === 'cancel') {
      this.cancelLast();
    }
  }

  render() {
    return (
      <Shortcuts name="NumbersForm" handler={this._handleShortcuts.bind(this)} targetNodeSelector="body">
        <Grid>
          <Row>
            <Col sm={12}>
              <h2>Des chiffres</h2>
            </Col>
            <Col sm={12}>
              <h4>Target number: {this.state.target}</h4>
            </Col>
            <Col sm={12}>
              { this.state.success ?
                <h2>Congratulations! <a href=""><Button bsStyle="info">Play again</Button></a></h2>
                :
                <NumbersForm {...this.state} submitOperation={this.submitOperation.bind(this)} toggleOp={this.toggleOp.bind(this)} toggleNumber={this.toggleNumber.bind(this)} />
              }
            </Col>
            <Col sm={12}>
              <NumbersHistory history={this.state.history} success={this.state.success} cancelLast={this.cancelLast.bind(this)} />
            </Col>
          </Row>
        </Grid>
      </Shortcuts>
    );
  }
}
