import React from 'react';
import {Navbar} from 'react-bootstrap';

export default class Navigation extends React.Component {
  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">TDeo</a>
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>
    )
  }
}
