import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store/configureStore';
import Root from './containers/Root';
import 'react-mdl/extra/material';
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/css/material.teal-red.min.css';
import './styles/style.css';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

render(
  <Root store={store} history={history} />,
  document.getElementById('root')
);
