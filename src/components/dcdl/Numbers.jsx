import React from 'react';
import { Button, Col, Collapse, Grid, Row } from 'react-bootstrap';
import { Shortcuts } from 'react-shortcuts';

import Dcdl from './Dcdl.jsx';
import NumbersForm from './NumbersForm.jsx';
import NumbersHistory from './NumbersHistory.jsx';
import Time from './Time.jsx';

export default class Numbers extends React.Component {
  state = {
    numbers: this.sortNumbers(this.randomNumbers()),
    target: this.randomTarget(),
    success: false,
    ops: this.defaultOps(),
    history: [],
    start: new Date(),
    timeLeft: 40,
    totalTime: 40,
  }

  init() {
    let state = {
      numbers: this.sortNumbers(this.randomNumbers()),
      target: this.randomTarget(),
      success: false,
      ops: this.defaultOps(),
      history: [],
      start: new Date(),
      timeLeft: 40,
      totalTime: 40,
    };
    this.setState({ state });

    clearInterval(this.timerId);
    this.timerId = setInterval(this.timeLeft.bind(this), 50);

    fetch('https://dcdl.herokuapp.com/solve', {
      method: 'POST',
      body: JSON.stringify({
        target: state.target,
        numbers: state.numbers.map(n => n.value),
      })
    }).then(r => r.json()).then(sol => {
      this.setState({ solution: sol });
    }).catch(err => {
      console.warn(err);
    });
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  timeLeft() {
    var left = this.state.totalTime - (new Date() - this.state.start) / 1000;
    this.setState({ timeLeft: left });
  }

  cancelLast() {
    if (this.state.history.length === 0) {
      return;
    }
    var history = this.state.history;
    var last = history.shift();
    var numbers = this.state.numbers;
    var i = numbers.findIndex((n) => {
      return (n.value === last.res);
    });
    numbers.splice(i, 1);
    numbers.push({ value: last.i, active: false });
    numbers.push({ value: last.j, active: false });
    this.setState({ numbers: this.sortNumbers(numbers), history: history });
  }

  toggleOp(event) {
    var idx = parseInt(event.target.value, 10);
    var ops = [];
    this.state.ops.forEach((op, i) => {
      ops.push({
        op: op.op,
        active: i === idx ? !op.active : false,
      });
    });
    this.setState({ ops: ops }, this.submitOperation);
  }

  toggleNumber(event) {
    var idx = parseInt(event.target.value, 10);
    var numbers = [];
    this.state.numbers.forEach((number, i) => {
      numbers.push({
        value: number.value,
        active: i === idx ? !number.active : number.active,
      });
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
    var a = Math.max(...activeNumbers.map(num => num.value));
    var b = Math.min(...activeNumbers.map(num => num.value));
    var newVal;

    if (op === '+') {
      newVal = a + b;
    } else if (op === '-') {
      newVal = a - b;
    } else if (op === '×') {
      newVal = a * b;
    } else if (op === '/') {
      if (a % b  === 0) {
        newVal = a / b;
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
      i: a,
      j: b,
      op: op,
      res: newVal,
    });
    if (newVal === this.state.target) {
      clearInterval(this.timerId);
    }
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
    return nums.sort((a, b) => {
      return a.value - b.value;
    });
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
    } while (indexes.length < 6);
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
      this.toggleNumber({ target: { value: action.replace('number', '') } });
    } else if (action.match(/^op\d$/)) {
      this.toggleOp({ target: { value: action.replace('op', '') } });
    } else if (action === 'cancel') {
      this.cancelLast();
    }
  }

  render() {
    const { solution, success, showSolution } = this.state;
    return (
      <Shortcuts name="NumbersForm" handler={this._handleShortcuts.bind(this)} targetNodeSelector="body">
        <Dcdl />
        <Grid>
          <Row>
            <Col xs={12} sm={6}>
              <Row>
                <Col xs={5}>
                  <br />
                  <Button bsStyle="primary" onClick={this.init.bind(this)}>Play again</Button>
                  <h2>Numbers</h2>
                  <h4>Target: {this.state.target}</h4>
                </Col>
                <Col xs={7}>
                  <br /><br />
                  <Time initial={this.state.totalTime} value={this.state.timeLeft} />
                </Col>
              </Row>
              <div>
                { success ?
                  <h2>Congratulations! <Button bsStyle="info" onClick={this.init.bind(this)}>Play again</Button></h2>
                  :
                  <h2>
                    <NumbersForm {...this.state} submitOperation={this.submitOperation.bind(this)} toggleOp={this.toggleOp.bind(this)} toggleNumber={this.toggleNumber.bind(this)} />
                  </h2>
                }
              </div>
              <div>
                <NumbersHistory history={this.state.history} success={success} cancelLast={this.cancelLast.bind(this)} />
              </div>
            </Col>
            { solution && <Col xs={12} sm={6}>
              <div>
                <h4>
                  <Button bsStyle="info"
                    onClick={() => this.setState({ showSolution: !showSolution }) }
                    style={{ marginRight: 20 }}>
                    Show solution
                  </Button>
                  {this.state.timeLeft < 20 && `Best possible: ${solution[solution.length - 1].res}`}
                </h4>
              </div>
              <Collapse in={!!showSolution}>
                <div>
                  <NumbersHistory history={solution} success={true} />
                </div>
              </Collapse>
            </Col>}
          </Row>
        </Grid>
      </Shortcuts>
    );
  }
}
