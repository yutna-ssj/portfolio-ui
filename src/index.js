import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './component/style.scss';
import reportWebVitals from './reportWebVitals';
import CoreRouter from './router/core-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { authReducer, httpReducer } from './redux/reducer';

export const store = createStore(combineReducers({ httpState: httpReducer, authState: authReducer }));

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <CoreRouter />
    </React.StrictMode>
  </Provider>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
