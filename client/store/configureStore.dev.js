import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from 'app/reducers';
import DevTools from 'app/containers/root/DevTools';
import apiMiddleware from 'app/middleware/api';

export default function configureStore(initialState) {
  // In development environments, use a logger, DevTools and enable hot
  // reloading reducers
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(
        thunk,
        apiMiddleware,
        routerMiddleware(browserHistory),
        createLogger()
      ),
      DevTools.instrument()
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      /* eslint-disable global-require */
      store.replaceReducer(require('../reducers').default);
    });
  }

  return store;
}
