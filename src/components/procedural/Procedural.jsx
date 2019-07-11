import React from 'react';
import { Button, Col, Grid, Row } from 'react-bootstrap';
import { Layer, Stage, Group, Line } from 'react-konva';

import './Procedural.css';

export default class Procedural extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: Math.floor(window.innerWidth * 0.8),
      height: Math.floor(window.innerHeight * 0.7),
      points: 40,
      alpha: 0.17,
      triangles: 6,
    };
    this.state.grid = this.grid();
  }

  random(a, b) { // int between a and b inclusive
    return Math.floor(a + (b - a + 1) * Math.random());
  }

  randomPoint() {
    return [this.random(0, this.state.width), this.random(0, this.state.height)];
  }

  grid() {
    var initial = [
      this.random(this.state.width / 3, 2 * this.state.width / 3),
      this.random(this.state.height / 3, 2 * this.state.height / 3),
    ];
    var shapes = [
      [[0, 0], [0, this.state.height], initial],
      [[0, this.state.height], [this.state.width, this.state.height], initial],
      [[this.state.width, this.state.height], [this.state.width, 0], initial],
      [[this.state.width, 0], [0, 0], initial],
    ];
    for (var j = 0; j < this.state.triangles; j++) {
      shapes = this.insertPoint(shapes);
      shapes = this.split(shapes);
    }
    return shapes;
  }

  area(shape) {
    return 0.5 * Math.abs(
      shape[0][0] * (shape[1][1] - shape[2][1]) +
      shape[1][0] * (shape[2][1] - shape[0][1]) +
      shape[2][0] * (shape[0][1] - shape[1][1])
    );
  }

  insertPoint(shapes) {
    shapes.sort((a, b) => {
      return (this.area(b) - this.area(a));
    });
    var idx = 0;
    var shape = shapes[idx];
    shapes.splice(idx, 1);
    var a = Math.random() * (1 - 4 * this.state.alpha) + 2 * this.state.alpha;
    var b = Math.random() * (1 - a - 2 * this.state.alpha) + this.state.alpha;
    var c = 1 - a - b;
    var point = [
      Math.round(shape[0][0] * a + shape[1][0] * b + shape[2][0] * c),
      Math.round(shape[0][1] * a + shape[1][1] * b + shape[2][1] * c),
    ];
    shapes.push(
      [shape[0], shape[1], point],
      [shape[1], shape[2], point],
      [shape[2], shape[0], point],
    );
    return shapes;
  }

  length(a, b) {
    return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
  }

  maxLength(shape) {
    return Math.max(
      this.length(shape[0], shape[1]),
      Math.max(
        this.length(shape[1], shape[2]),
        this.length(shape[2], shape[0]),
      ),
    );
  }

  split(shapes) {
    shapes.sort((a, b) => {
      return this.maxLength(b) - this.maxLength(a);
    });
    var idx = 0;
    var shape = shapes[idx];
    shapes.splice(idx, 1);
    var a, b, c;
    if (this.length(shape[0], shape[1]) > this.maxLength(shape) - 1) {
      a = shape[2];
      b = shape[1];
      c = shape[0];
    } else if (this.length(shape[1], shape[2]) > this.maxLength(shape) - 1) {
      a = shape[0];
      b = shape[1];
      c = shape[2];
    } else {
      a = shape[1];
      b = shape[2];
      c = shape[0];
    }
    var alpha = Math.random() * (1 - 3 * this.state.alpha) + 1.5 * this.state.alpha;
    var d = [
      alpha * b[0] + (1 - alpha) * c[0],
      alpha * b[1] + (1 - alpha) * c[1]
    ];
    shapes.push(
      [a, b, d],
      [a, c, d],
    );
    return shapes;
  }

  randomColor() {
    var h = this.random(1, 360);
    var s = this.random(50, 80);
    var l = this.random(30, 50);
    return `hsl(${h},${s}%,${l}%)`;
  }

  strings(shape) {
    var i = Math.floor(3 * Math.random());
    var a = shape[i];
    var b, c;
    if (i === 0) {
      b = shape[1];
      c = shape[2];
    } else {
      b = shape[0];
      c = shape[3 - i];
    }
    var l = Math.sqrt(Math.pow(b[0] - c[0], 2) + Math.pow(b[1] - c[1], 2));
    var alpha = Math.acos(
      ((b[0] - a[0]) * (c[0] - a[0]) + (b[1] - a[1]) * (c[1] - a[1])) / Math.abs(
        this.length(a, b) * this.length(a, c)
      )
    );
    var density = Math.max(3, Math.min(l / 15, alpha * 9));
    var count = Math.floor(density * (3 + Math.random()));
    var color = this.randomColor();

    return (
      [...Array(count)].map((el, i) => {
        var d = [
          Math.round(((i + 1) * b[0] + (count - i) * c[0]) / (count + 1)),
          Math.round(((i + 1) * b[1] + (count - i) * c[1]) / (count + 1)),
        ];
        return (
          <Line x={0} y={0} points={[a[0], a[1], d[0], d[1]]} key={i}
            strokeLinearGradientColorStops={[
              0, '#555', 0.1, '#555', 0.5, color, 0.9, '#555', 1, '#555'
            ]}
            strokeLinearGradientStartPoint={{ x: a[0], y: a[1] }}
            strokeLinearGradientEndPoint={{ x: d[0], y: d[1] }}
            strokeWidth={1}
          />
        );
      })
    );
  }

  render() {
    return (
      <div>
        <Grid>
          <style>{'canvas { margin-bottom: 10px !important; }'}</style>
          <Row>
            <Col xs={12}>
              <h2>Triangular art</h2>
              <Row>
                <Col xs={8}>
                  <span>
                    Inspired from an artwork engraved into wood, gave me the idea to generate
                    geometric figures and play with HTML canvas.
                  </span>
                </Col>
                <Col xs={4}>
                  <Button bsStyle="primary" onClick={() => this.setState({ grid: this.grid() })}>Again !</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Grid>
        <Grid fluid={true}>
          <Row>
            <Col xs={12}>
              <Stage
                style={{ width: '100%' }}
                width={this.state.width}
                height={this.state.height}>
                <Layer>
                  {this.state.grid.map((shape, i) => {
                    return (
                      <Group key={i}>
                        {this.strings(shape)}
                        <Line points={shape.flat()} closed stroke="black" strokeWidth={2} />
                      </Group>
                    );
                  })}
                  <Line x={0} y={0} closed points={[0,0,0,this.state.height,this.state.width,this.state.height,this.state.width,0]} stroke="black" strokeWidth={8} />
                </Layer>
              </Stage>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
