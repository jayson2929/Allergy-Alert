import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux"
import rootStore from "./ReduxStore"

ReactDOM.render(
  <Provider store = {rootStore}>
    <App />
  </Provider>,
  document.getElementById('root')
);
reportWebVitals();
