import React, { Component } from 'react';
import {Grid} from 'semantic-ui-react';
import logo from './logo.svg';
import './App.css';
import Tuner from './Tuner.jsx'
import Metronome from "./Metronome";

class App extends Component {
  render() {
      return <div className="App">

          <Grid columns='equal' padded doubling stackable fluid centered >

              <Tuner/>

          </Grid>


      </div>;
  }
}

export default App;
