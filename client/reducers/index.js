import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { DOCUMENTS_SUCCESS, DOCUMENTS_FAILURE } from 'app/actions';

function documents(state = [], action) {
  switch (action.type) {
    case DOCUMENTS_FAILURE:
      return [];
    case DOCUMENTS_SUCCESS:
      return action.response;
    default:
      return state;
  }
}

function error(state = {}, action) {
  switch (action.type) {
    case DOCUMENTS_FAILURE:
      return action.error;
    case DOCUMENTS_SUCCESS:
      return {};
    default:
      return state;
  }
}

export default combineReducers({
  documents,
  error,
  routing,
});
