import PropTypes from 'prop-types';
import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { ShortcutManager } from 'react-shortcuts';
import * as Sentry from '@sentry/browser';

import keymap from '../keymap';
import './App.css';

import Navigation from './Navigation';
// Navbar
import Maps from './maps';
import DiceIndex from './dice';
import Experiments from './Experiments';
// Experiments
import Dcdl from './dcdl';
import Numbers from './dcdl/Numbers';
import Procedural from './procedural';
// Other pages
import Cv from './cv';
import IsItFive from './IsItFive';
import Yahtzee from './yahtzee';
// Not found
import NotFound from './NotFound';

import TheGame from './TheGame';

const shortcutManager = new ShortcutManager(keymap);

if (window.location.hostname !== 'localhost') {
  Sentry.init({
    dsn: 'https://9cfddc0ec998438095a6f884a1600e51@sentry.io/1309901'
  });
}

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
          <Switch>
            <Route exact path="/" component={Experiments} />
            <Route path="/maps" component={Maps} />
            <Route path="/dice" component={DiceIndex} />
            <Route path="/experiments" component={Experiments} />
            <Route path="/isitfive" component={IsItFive} />
            <Route path="/dcdl/numbers" component={Numbers} />
            <Route path="/dcdl" component={Dcdl} />
            <Route path="/cv" component={Cv} />
            <Route path="/procedural" component={Procedural} />
            <Route path="/yahtzee" component={Yahtzee} />
            <Route path="/thegame" component={TheGame} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

App.childContextTypes = {
  shortcuts: PropTypes.object.isRequired
};
