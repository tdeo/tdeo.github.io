import PropTypes from 'prop-types';
import React from 'react';
import { Route } from 'react-router-dom';
import { ShortcutManager } from 'react-shortcuts';

import keymap from '../keymap.jsx';

import Index from './Index.jsx';
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

export default class App extends React.Component {
  getChildContext() {
    return { shortcuts: shortcutManager };
  }

  render() {
    return (
      <div>
        <Navigation />
        <Route exact path="/" component={Index}/>
        <Route path="/maps" component={Maps}/>
        <Route path="/dice" component={DiceIndex}/>
        <Route path="/experiments" component={Experiments}/>
        <Route path="/isitfive" component={IsItFive}/>
        <Route path="/dcdl" component={Dcdl}/>
        <Route path="/dcdl/numbers" component={Numbers}/>
        <Route path="/cv" component={Cv}/>
        <Route path="/procedural" component={Procedural}/>
      </div>
    );
  }
}

App.childContextTypes = {
  shortcuts: PropTypes.object.isRequired
};
