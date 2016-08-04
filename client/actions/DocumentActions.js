import { API } from 'app/middleware/api';

import {
  DOCUMENTS_REQUEST, DOCUMENTS_SUCCESS, DOCUMENTS_FAILURE,
} from './ActionTypes';

export function fetchDocuments() {
  return {
    [API]: {
      types: [DOCUMENTS_REQUEST, DOCUMENTS_SUCCESS, DOCUMENTS_FAILURE],
      payload: (request) => request.get('/api/documents'),
    },
  };
}
