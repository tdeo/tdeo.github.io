import React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';

export default class IsItFive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
      this.tick();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({ date: new Date() });
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col sm={12}>
              <h1>Is it five already?</h1>
            </Col>
          </Row>
          <br />
          <Row>
            <Col sm={12}>
              <h2>
                { (this.state.date.getHours() >= 17) ? 'Yes, finally!' : 'No, not yet' }
              </h2>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
