import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Button, ButtonToolbar, Form, FormControl } from 'react-bootstrap';

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
      <Grid>
        <Row>
          <Col>
            Current dices:{' '}
            <ButtonToolbar>
              {this.state.dices.map((dice, i) => {
                return (
                  <Button key={`${i},${dice.sides}`} onClick={this.deleteDice} value={i}
                    style={{
                      boxShadow: "inset 0px 3px 3px rgba(0,0,0,0.25), inset 0px -3px 3px rgba(0,0,0,0.25), inset -3px 0px 3px rgba(0,0,0,0.25), inset 3px 0px 3px rgba(0,0,0,0.25)",
                      backgroundColor: "rgba(200,200,200,1)",
                      fontWeight: "bold",
                    }}>
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
