import React from 'react';
import { Route } from 'react-router-dom';

import Index from './Index.jsx';
import Maps from './maps/Maps.jsx';
import DiceIndex from './dice/DiceIndex.jsx';
import Navigation from './Navigation.jsx';
import IsItFive from './isitfive/IsItFive.jsx';
import Dcdl from './dcdl/Dcdl.jsx';
import Chiffres from './dcdl/Chiffres.jsx';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Navigation />
        <Route exact path="/" component={Index}/>
        <Route path="/maps" component={Maps}/>
        <Route path="/dice" component={DiceIndex}/>
        <Route path="/isitfive" component={IsItFive}/>
        <Route path="/dcdl" component={Dcdl}/>
        <Route path="/dcdl/chiffres" component={Chiffres}/>
      </div>
    );
  }
}
