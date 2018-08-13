import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col sm={12}>
              <h1>TDeo&apos;s web experiments</h1>
              This is a collection of project / ideas / services that I put together on various occasions.
              And now it&apos;s also meant to learn some different client-side technologies.
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
