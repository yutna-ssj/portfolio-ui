import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './component/style.scss';
import reportWebVitals from './reportWebVitals';
import CoreComponent from './component/core-component/core-component';
import CoreRouter from './router/core-router';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
    <CoreRouter />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
