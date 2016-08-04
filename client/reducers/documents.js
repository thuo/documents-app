import {
  DOCUMENTS_SUCCESS, DOCUMENTS_FAILURE,
  DOCUMENTS_ADD_SUCCESS, DOCUMENTS_ADD_FAILURE,
} from 'app/actions/ActionTypes';

export function documents(state = { list: [], error: null }, action) {
  switch (action.type) {
    case DOCUMENTS_SUCCESS:
      return {
        list: action.response,
        error: null,
      };
    case DOCUMENTS_FAILURE:
      return {
        list: [],
        error: action.error.error,
      };
    case DOCUMENTS_ADD_SUCCESS:
      return {
        list: [action.response, ...state.list],
        error: state.error,
      };
    default:
      return state;
  }
}

export function addDocumentError(state = null, action) {
  switch (action.type) {
    case DOCUMENTS_ADD_SUCCESS:
      return null;
    case DOCUMENTS_ADD_FAILURE:
      return action.error;
    default:
      return state;
  }
}
