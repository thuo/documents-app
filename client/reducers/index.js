import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { documents } from './documents';

export default combineReducers({
  documents,
  routing,
});
