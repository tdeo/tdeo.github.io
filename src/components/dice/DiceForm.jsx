import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Button, ButtonToolbar, Form, FormControl } from 'react-bootstrap';

export default class DiceForm extends React.Component {
  static defaultProps = {
      dices: [],
      sides: 6,
  };

  static propTypes = {
    sides: PropTypes.number,
    dices: PropTypes.arrayOf(PropTypes.shape({
      sides: PropTypes.number,
    })),
  };

  constructor(props) {
    super(props);
    this.state = {
      sides: (this.props.dices.length === 0) ? 6 : this.props.dices.slice(-1)[0].sides,
      dices: this.props.dices
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteDice = this.deleteDice.bind(this);
  }

  handleChange(event) {
    this.setState({ sides: event.target.value });
  }

  handleSubmit(event) {
    this.setState({ dices: this.props.dices.push({ sides: this.state.sides }) });
    event.preventDefault();
  }

  deleteDice(event) {
    var dices = this.props.dices.splice(event.target.value, 1);
    this.setState({ dices: dices });
  }

  render() {
    return(
      <Grid>
        <Row>
          <Col>
            Current dices:{' '}
            <ButtonToolbar>
              {this.props.dices.map((dice, i) => {
                return (
                  <Button className="active" bsStyle="info" key={`${i},${dice.sides}`} onClick={this.deleteDice} value={i}>
                    {dice.sides}
                  </Button>
                );
              })}
            </ButtonToolbar>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Form inline onSubmit={this.handleSubmit}>
              Add one dice with{' '}
              <FormControl
                style={{ maxWidth: "60px" }}
                id="sides"
                type="number"
                min="1"
                max="99"
                value={this.state.sides}
                onChange={this.handleChange}/>{' '}
              sides.{' '}
              <Button bsStyle="primary" type="submit">Add</Button>
            </Form>
          </Col>
        </Row>
      </Grid>
    );
  }
}
