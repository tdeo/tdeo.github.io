import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Grid, Row } from 'react-bootstrap';

export default class NotFound extends React.Component {
  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col sm={12} className="text-center">
              Sorry, this page can&quot;t be found, try going back
              to the <Link to="/">index</Link>.
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
