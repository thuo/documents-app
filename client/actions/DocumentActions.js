import { API } from 'app/middleware/api';

import {
  DOCUMENTS_REQUEST, DOCUMENTS_SUCCESS, DOCUMENTS_FAILURE,
  DOCUMENTS_ADD_REQUEST, DOCUMENTS_ADD_SUCCESS, DOCUMENTS_ADD_FAILURE,
} from './ActionTypes';

export function fetchDocuments() {
  return {
    [API]: {
      types: [DOCUMENTS_REQUEST, DOCUMENTS_SUCCESS, DOCUMENTS_FAILURE],
      payload: (request) => request.get('/api/documents'),
    },
  };
}

export function addDocument(doc) {
  return (dispatch, getState) => dispatch({
    [API]: {
      types: [
        DOCUMENTS_ADD_REQUEST, DOCUMENTS_ADD_SUCCESS, DOCUMENTS_ADD_FAILURE,
      ],
      payload: request => request
        .post('/api/documents')
        .set('X-Access-Token', getState().authenticatedUser.token)
        .send(doc),
    },
  });
}
