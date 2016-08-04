import {
  DOCUMENTS_SUCCESS, DOCUMENTS_FAILURE,
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
    default:
      return state;
  }
}
