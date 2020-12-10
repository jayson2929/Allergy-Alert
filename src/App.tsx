import React, { Component } from 'react';
import './App.css';

import {
  HeaderComponent
} from "./components/Header"
import {
  HallSelectorContainer
} from "./components/HallSelectorContainer"
import {
  ContentsContainer
} from "./components/ContentsContainer"

export class App extends Component {
  render() : JSX.Element {
    return (
      <div className = "App">
        <HeaderComponent/>
        <HallSelectorContainer/>
        <ContentsContainer/>
      </div>
    )
  }
}
