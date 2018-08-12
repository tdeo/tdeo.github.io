import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToolbar, Form, FormControl } from 'react-bootstrap';

import './Dice.css';

export default class DiceForm extends React.Component {
  static propTypes = {
    deleteDice: PropTypes.func,
    onSubmit: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = props;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteDice = this.deleteDice.bind(this);
  }

  handleChange(event) {
    this.setState({ sides: event.target.value });
  }

  handleSubmit(event) {
    this.props.onSubmit(this.state);
    event.preventDefault();
  }

  deleteDice(event) {
    this.props.deleteDice(event.target.value);
  }

  render() {
    return(
      <div>
        <div>
          Current dices (click to remove):
          <ButtonToolbar>
            {this.state.dices.map((dice, i) => {
              return (
                <Button key={`${i},${dice.sides}`} onClick={this.deleteDice} value={i}
                  className="dice">
                  {dice.sides}
                </Button>
              );
            })}
          </ButtonToolbar>
        </div>

        <div>
          <Form inline onSubmit={this.handleSubmit}>
            Add one dice with{' '}
            <FormControl
              style={{ maxWidth: "60px", display: "inline-block" }}
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
