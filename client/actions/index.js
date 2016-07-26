import { API } from 'app/middleware/api';

export const DOCUMENTS_REQUEST = 'DOCUMENTS_REQUEST';
export const DOCUMENTS_SUCCESS = 'DOCUMENTS_SUCCESS';
export const DOCUMENTS_FAILURE = 'DOCUMENTS_FAILURE';

export function fetchDocuments() {
  return {
    [API]: {
      types: [DOCUMENTS_REQUEST, DOCUMENTS_SUCCESS, DOCUMENTS_FAILURE],
      payload: (request) => request.get('/api/documents'),
    },
  };
}
