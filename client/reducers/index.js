import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { documentList, addDocument, documentPage } from './documents';
import { signUp, authenticatedUser, logIn } from './auth';
import entities from './entities';

export default combineReducers({
  entities,
  documentList,
  addDocument,
  documentPage,
  signUp,
  logIn,
  authenticatedUser,
  routing,
});
