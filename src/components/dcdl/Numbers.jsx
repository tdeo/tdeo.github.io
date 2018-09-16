import React from 'react';
import { Button, Col, Collapse, Grid, Row } from 'react-bootstrap';
import { Shortcuts } from 'react-shortcuts';

import NumbersForm from './NumbersForm.jsx';
import NumbersHistory from './NumbersHistory.jsx';
import Time from './Time.jsx';

export default class Numbers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numbers: this.sortNumbers(this.randomNumbers()),
      target: this.randomTarget(),
      success: false,
      ops: this.defaultOps(),
      history: [],
      start: new Date(),
      timeLeft: 40,
      totalTime: 40,
    };
  }

  componentDidMount() {
    this.timerId = setInterval(this.timeLeft.bind(this), 50);
    this.findSolution().then(
      (sol) => {
        this.setState({ solution: sol });
      }).catch(
      (error) => {
        console.warn(error);
      });
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  timeLeft() {
    var left = this.state.totalTime - (new Date() - this.state.start) / 1000;
    this.setState({ timeLeft: left });
  }

  async findSolution() {
    await setTimeout(() => {}, 5000);
    var numbers = this.state.numbers.map((num) => {
      return num.value;
    });
    var s;
    for (var i = 0; i < 50; ++i) {
      s = this.solution(this.state.target - i, numbers);
      if (s === undefined && i > 0) {
        s = this.solution(this.state.target + i, numbers);
      }
      if (s !== undefined) {
        return s;
      }
    }
  }

  solution(target, numbers) {
    if (target === 0) {
      return [];
    } else if (numbers.length === 0) {
      return undefined;
    }

    for (var i = 0; i < numbers.length; i++) {
      var num = numbers[i];
      var others = numbers.slice(0, i).concat(numbers.slice(i + 1));
      var shortest;
      var s;
      if (target - num >= 0) {
        s = this.solution(target - num, others);
        if (s !== undefined && (shortest === undefined || s.length < shortest.length)) {
          shortest = s.concat({ a: target - num, b: num, op: '+', res: target });
        }
      }
      if (target % num === 0) {
        s = this.solution(target / num, others);
        if (s !== undefined && (shortest === undefined || s.length < shortest.length)) {
          shortest = s.concat({ a: target / num, b: num, op: '*', res: target });
        }
      }
      s = this.solution(target + num, others);
      if (s !== undefined && (shortest === undefined || s.length < shortest.length)) {
        shortest = s.concat({ a: target + num, b: num, op: '-', res: target });
      }
      s = this.solution(target * num, others);
      if (s !== undefined && (shortest === undefined || s.length < shortest.length)) {
        shortest = s.concat({ a: target * num, b: num, op: '/', res: target });
      }
    }
    return shortest;
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
    numbers.push({ value: last.a, active: false });
    numbers.push({ value: last.b, active: false });
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
      a: a,
      b: b,
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
    return (
      <Shortcuts name="NumbersForm" handler={this._handleShortcuts.bind(this)} targetNodeSelector="body">
        <Grid>
          <Row>
            <Col xs={12} sm={7}>
              <Row>
                <Col xs={5}>
                  <h2>Numbers</h2>
                  <h4>Target: {this.state.target}</h4>
                </Col>
                <Col xs={7}>
                  <Time initial={this.state.totalTime} value={this.state.timeLeft} />
                </Col>
              </Row>
              <div>
                { this.state.success ?
                  <h2>Congratulations! <a href=""><Button bsStyle="info">Play again</Button></a></h2>
                  :
                  <h2>
                    <NumbersForm {...this.state} submitOperation={this.submitOperation.bind(this)} toggleOp={this.toggleOp.bind(this)} toggleNumber={this.toggleNumber.bind(this)} />
                  </h2>
                }
              </div>
              <div>
                <NumbersHistory history={this.state.history} success={this.state.success} cancelLast={this.cancelLast.bind(this)} />
              </div>
            </Col>
            { this.state.solution && <Col xs={12} sm={5}>
              <Row>
                <Col xs={12}>
                  <h2>&nbsp;</h2>
                  <h4 className={this.state.showSolution ? '' : 'invisible'}>Best solution: {this.state.solution[this.state.solution.length - 1].res}</h4>
                </Col>
              </Row>
              <div>
                <h2>
                  <Button bsStyle="info" onClick={() => this.setState({ showSolution: !this.state.showSolution }) }>
                    Show solution
                  </Button>
                </h2>
              </div>
              <Collapse in={!!this.state.showSolution}>
                <div>
                  <NumbersHistory history={this.state.solution.slice(1)} success={true} />
                </div>
              </Collapse>
            </Col>}
          </Row>
        </Grid>
      </Shortcuts>
    );
  }
}
