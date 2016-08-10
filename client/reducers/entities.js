import merge from 'lodash/merge';
import omit from 'lodash/omit';
import { DOCUMENT_DELETE_SUCCESS } from 'app/actions/ActionTypes';
const initialState = { documents: {}, users: {}, roles: {} };

export default function entities(state = initialState, action) {
  switch (action.type) {
    case DOCUMENT_DELETE_SUCCESS:
      return Object.assign({}, state, {
        documents: omit(state.entities, action.documentId),
      });
    default:
      if (action.response && action.response.entities) {
        return merge({}, state, action.response.entities);
      }
      return state;
  }
}
