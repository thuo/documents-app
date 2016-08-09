import { API, Schemas } from 'app/middleware/api';

import {
  DOCUMENTS_REQUEST, DOCUMENTS_SUCCESS, DOCUMENTS_FAILURE,
  DOCUMENTS_ADD_REQUEST, DOCUMENTS_ADD_SUCCESS, DOCUMENTS_ADD_FAILURE,
  DOCUMENT_GET_REQUEST, DOCUMENT_GET_SUCCESS, DOCUMENT_GET_FAILURE,
  DOCUMENT_UPDATE_REQUEST, DOCUMENT_UPDATE_SUCCESS, DOCUMENT_UPDATE_FAILURE,
} from './ActionTypes';

export function fetchDocuments() {
  return {
    [API]: {
      types: [DOCUMENTS_REQUEST, DOCUMENTS_SUCCESS, DOCUMENTS_FAILURE],
      payload: (request) => request.get('/api/documents'),
      schema: Schemas.DOCUMENT_ARRAY,
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
      schema: Schemas.DOCUMENT,
    },
  });
}

export function editDocument(documentId, values) {
  return (dispatch, getState) => dispatch({
    [API]: {
      types: [
        DOCUMENT_UPDATE_REQUEST,
        DOCUMENT_UPDATE_SUCCESS,
        DOCUMENT_UPDATE_FAILURE,
      ],
      payload: request => request
        .put(`/api/documents/${documentId}`)
        .set(
          'X-Access-Token',
          getState().authenticatedUser && getState().authenticatedUser.token
        )
        .send(values),
      schema: Schemas.DOCUMENT,
    },
  });
}

export function fetchDocument(documentId) {
  return (dispatch, getState) => dispatch({
    [API]: {
      types: [
        DOCUMENT_GET_REQUEST, DOCUMENT_GET_SUCCESS, DOCUMENT_GET_FAILURE,
      ],
      payload: request => request
        .get(`/api/documents/${documentId}`)
        .set(
          'X-Access-Token',
          getState().authenticatedUser && getState().authenticatedUser.token
        ),
      schema: Schemas.DOCUMENT,
    },
  });
}

function shouldFetchDocument(state, documentId) {
  return !state.entities.documents[documentId];
}

export function fetchDocumentIfNeeded(documentId) {
  return (dispatch, getState) => {
    if (shouldFetchDocument(getState(), documentId)) {
      return dispatch(fetchDocument(documentId));
    }
    return Promise.resolve();
  };
}
