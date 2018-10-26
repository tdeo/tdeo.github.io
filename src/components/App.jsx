import PropTypes from 'prop-types';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ShortcutManager } from 'react-shortcuts';
import * as Sentry from '@sentry/browser';

import keymap from '../keymap.jsx';

import Navigation from './Navigation.jsx';
// Navbar
import Maps from './maps/Maps.jsx';
import DiceIndex from './dice/DiceIndex.jsx';
import Experiments from './experiments/Experiments';
// Experiments
import Dcdl from './dcdl/Dcdl.jsx';
import Numbers from './dcdl/Numbers.jsx';
import Procedural from './procedural/Procedural.jsx';
// Other pages
import Cv from './cv/Cv.jsx';
import IsItFive from './isitfive/IsItFive.jsx';

const shortcutManager = new ShortcutManager(keymap);

Sentry.init({
  dsn: 'https://9cfddc0ec998438095a6f884a1600e51@sentry.io/1309901'
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
  }

  getChildContext() {
    return { shortcuts: shortcutManager };
  }

  render() {
    return (
      <Router>
        <div>
          <Navigation />
          <Route exact path="/" component={Experiments}/>
          <Route path="/maps" component={Maps}/>
          <Route path="/dice" component={DiceIndex}/>
          <Route path="/experiments" component={Experiments}/>
          <Route path="/isitfive" component={IsItFive}/>
          <Route path="/dcdl" component={Dcdl}/>
          <Route path="/dcdl/numbers" component={Numbers}/>
          <Route path="/cv" component={Cv}/>
          <Route path="/procedural" component={Procedural}/>
        </div>
      </Router>
    );
  }
}

App.childContextTypes = {
  shortcuts: PropTypes.object.isRequired
};
