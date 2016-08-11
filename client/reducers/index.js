import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import {
  documentList, addDocument, documentPage, editDocument,
} from './documents';
import { signUp, authenticatedUser, logIn } from './auth';
import { userPage } from './users';
import entities from './entities';

export default combineReducers({
  entities,
  documentList,
  addDocument,
  documentPage,
  editDocument,
  signUp,
  logIn,
  authenticatedUser,
  userPage,
  routing,
});
