import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { documents, addDocumentError } from './documents';
import { signUpError, authenticatedUser, loginError } from './auth';

export default combineReducers({
  documents,
  addDocumentError,
  signUpError,
  loginError,
  authenticatedUser,
  routing,
});
