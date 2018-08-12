import React from 'react';
import { Route } from 'react-router-dom';

import Index from './Index.jsx';
import Maps from './maps/Maps.jsx';
import Dice from './dice/Dice.jsx';
import Navigation from './Navigation.jsx';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Navigation />
        <Route exact path="/" component={Index}/>
        <Route path="/maps" component={Maps}/>
        <Route path="/dice" component={Dice}/>
      </div>
    );
  }
}
