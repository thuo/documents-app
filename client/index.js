import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store/configureStore';
import Root from './containers/root/Root';
import getUserFromToken from './utils/getUserFromToken';
import 'react-mdl/extra/material';
import 'react-mdl/extra/css/material.teal-red.min.css';
import './styles/style.css';

const token = window.localStorage.getItem('token');
const authenticatedUser = token && getUserFromToken(token);

const store = configureStore({ authenticatedUser });
const history = syncHistoryWithStore(browserHistory, store);

store.subscribe(() => {
  const { authenticatedUser: user } = store.getState();
  if (user && user.token) {
    window.localStorage.setItem('token', user.token);
  } else {
    window.localStorage.removeItem('token');
  }
});

render(
  <Root store={store} history={history} />,
  document.getElementById('root')
);
