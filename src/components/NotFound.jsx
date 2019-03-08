import React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';

export default class NotFound extends React.Component {
  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col sm={12} className="text-center">
              Sorry, this page can&quot;t be found, try going back to the <a href="/">index</a>.
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
