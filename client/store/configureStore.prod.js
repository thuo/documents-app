import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from 'app/reducers';
import apiMiddleware from 'app/middleware/api';

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      thunk,
      apiMiddleware,
      routerMiddleware(browserHistory)
    )
  );
}
