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
        title: 'Ger the number',
        url: '/dcdl/numbers',
        content: 'Copy of a french TV game, you need to get to a result given 6 initial numbers and the 4 elementary operations',
        image: '/images/numbers.png',
      },
      {
        title: 'Dices',
        url: '/dice',
        content: 'Dice simulator created for playing games, keeps track of the throws outcome and compares it'+
          ' to the theoretical distribution.',
        image: '/images/dice.png',
      },
      {
        title: 'Maps HD',
        url: '/maps',
        content: 'Creates a satellite map of a region by re-aggregating different satellite images together.',
      },
    ];

    return (
      <Grid>
        <Row>
          <Col xs={12} sm={8} smOffset={2}>
            <h5>
              This is a collection of project / ideas / services that I put together on various occasions. They range from
              a pure learning opportunity to making something useful for a friend.
            </h5>
          </Col>
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
