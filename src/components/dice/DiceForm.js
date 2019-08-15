import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToolbar, Form, FormControl, Popover, OverlayTrigger } from 'react-bootstrap';
import { ChromePicker } from 'react-color';

import Dice from './Dice';

export default class DiceForm extends React.Component {
  state = {
    sides: 6,
    color: '#f2f2f2',
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
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit(event) {
    this.props.addDice(this.state.sides, this.state.color);
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
                  val={dice.sides} color={dice.color} />
              );
            })}
          </ButtonToolbar>
        </div>

        <div>
          <Form inline onSubmit={this.handleSubmit}>
            Add a dice with{' '}
            <FormControl
              style={{ maxWidth: '60px', display: 'inline-block' }}
              id="sides"
              type="number"
              min="1"
              max="99"
              value={this.state.sides}
              onChange={this.handleChange}/>{' '}
            sides and color{' '}
            <OverlayTrigger trigger="click" placement="bottom" overlay={
              <Popover id="color-picker-popover">
                <ChromePicker color={this.state.color} onChange={(color) => this.setState({ color: color.hex })} />
              </Popover>
            }>
              <Dice val="?" color={this.state.color}/>
            </OverlayTrigger>
            {' '}:{' '}
            <Button bsStyle="primary" type="submit">Add</Button>
          </Form>
        </div>
      </div>
    );
  }
}
