import React from 'react';
import { Col, Grid, Row, Panel } from 'react-bootstrap';

export default class Experiments extends React.Component {
  render() {
    const pages = [
      {
        title: 'Triangular art',
        url: '/procedural',
        content: 'Random generation of colorful geometric images with triangular shapes',
        image: '/images/triangular.png',
      },
      {
        title: 'Make the number',
        url: '/dcdl/numbers',
        content: 'Copy of a french TV game, you need to get to a result given 6 numbers and the 4 elementary operations',
        image: '/images/numbers.png',
      },
    ];

    return (
      <Grid>
        <Row>
          <Col sm={2} xsHidden />
          {pages.map((page, i) => {
            return (
              <Col xs={12} sm={4} key={i}>
                <Panel onClick={() => {
                  window.location.href = page.url;
                }} bsStyle="info">
                  <Panel.Heading>
                    <Panel.Title componentClass="h3">
                      {page.title}
                    </Panel.Title>
                  </Panel.Heading>
                  <Panel.Body>
                    {page.content}
                  </Panel.Body>
                  {page.image &&
                    <Panel.Body>
                      <img src={page.image} width="100%" alt=""/>
                    </Panel.Body>
                  }
                </Panel>
              </Col>
            );
          })}
        </Row>
      </Grid>
    );
  }
}
