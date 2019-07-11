import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToolbar, Form, FormControl } from 'react-bootstrap';

import Dice from './Dice.jsx';

export default class DiceForm extends React.Component {
  state = {
    sides: 6
  }

  static propTypes = {
    deleteDice: PropTypes.func,
    addDice: PropTypes.func,
    dices: PropTypes.arrayOf(PropTypes.shape({
      sides: PropTypes.number,
    })),
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteDice = this.deleteDice.bind(this);
  }

  handleChange(event) {
    this.setState({ sides: parseInt(event.target.value, 10) });
  }

  handleSubmit(event) {
    this.props.addDice(this.state.sides);
    event.preventDefault();
  }

  deleteDice(event) {
    this.props.deleteDice(event.target.value);
  }

  render() {
    return (
      <div>
        <div>
          Current dices (click to remove):
          <ButtonToolbar>
            {this.props.dices.map((dice, i) => {
              return (
                <Dice key={i} onClick={this.deleteDice} value={i}
                  val={dice.sides} />
              );
            })}
          </ButtonToolbar>
        </div>

        <div>
          <Form inline onSubmit={this.handleSubmit}>
            Add one dice with{' '}
            <FormControl
              style={{ maxWidth: '60px', display: 'inline-block' }}
              id="sides"
              type="number"
              min="1"
              max="99"
              value={this.state.sides}
              onChange={this.handleChange}/>{' '}
            sides:{' '}
            <Button bsStyle="primary" type="submit">Add</Button>
          </Form>
        </div>
      </div>
    );
  }
}
