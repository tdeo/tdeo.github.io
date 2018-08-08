import React from 'react';
import Navigation from './Navigation.jsx';
import {Grid, Row, Col} from 'react-bootstrap';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Navigation />
        <Grid>
          <Row>
            <Col className="text-center">
              <h1>TDeo's web experiments</h1>
              This is a collection of project / ideas / services that I put together on various occasions.
              And now it's also meant to learn some different client-side technologies.
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
