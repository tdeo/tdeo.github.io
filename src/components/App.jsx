import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import Index from './Index.jsx';
import Maps from './maps/Maps.jsx';
import DiceIndex from './dice/DiceIndex.jsx';
import Navigation from './Navigation.jsx';
import IsItFive from './isitfive/IsItFive.jsx';
import Dcdl from './dcdl/Dcdl.jsx';
import Numbers from './dcdl/Numbers.jsx';

import keymap from '../keymap.jsx';
import { ShortcutManager } from 'react-shortcuts';

const shortcutManager = new ShortcutManager(keymap);

export default class App extends React.Component {
  getChildContext() {
    return { shortcuts: shortcutManager }
  }

  render() {
    return (
      <div>
        <Navigation />
        <Route exact path="/" component={Index}/>
        <Route path="/maps" component={Maps}/>
        <Route path="/dice" component={DiceIndex}/>
        <Route path="/isitfive" component={IsItFive}/>
        <Route path="/dcdl" component={Dcdl}/>
        <Route path="/dcdl/chiffres" component={Numbers}/>
      </div>
    );
  }
}

App.childContextTypes = {
  shortcuts: PropTypes.object.isRequired
}
