import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { documents } from './documents';
import { signUpError, authenticatedUser, loginError } from './auth';

export default combineReducers({
  documents,
  signUpError,
  loginError,
  authenticatedUser,
  routing,
});
