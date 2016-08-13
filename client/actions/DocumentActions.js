import { API, Schemas } from 'app/middleware/api';
import getTokenFromState from 'app/utils/getTokenFromState';
import {
  DOCUMENTS_REQUEST, DOCUMENTS_SUCCESS, DOCUMENTS_FAILURE,
  DOCUMENTS_ADD_REQUEST, DOCUMENTS_ADD_SUCCESS, DOCUMENTS_ADD_FAILURE,
  DOCUMENT_GET_REQUEST, DOCUMENT_GET_SUCCESS, DOCUMENT_GET_FAILURE,
  DOCUMENT_UPDATE_REQUEST, DOCUMENT_UPDATE_SUCCESS, DOCUMENT_UPDATE_FAILURE,
  DOCUMENT_DELETE_REQUEST, DOCUMENT_DELETE_SUCCESS, DOCUMENT_DELETE_FAILURE,
} from './ActionTypes';

export function fetchDocuments() {
  return (dispatch, getState) => dispatch({
    [API]: {
      types: [DOCUMENTS_REQUEST, DOCUMENTS_SUCCESS, DOCUMENTS_FAILURE],
      payload: request => request
        .get('/api/documents')
        .set('X-Access-Token', getTokenFromState(getState())),
      schema: Schemas.DOCUMENT_ARRAY,
    },
  });
}

export function addDocument(doc) {
  return (dispatch, getState) => dispatch({
    [API]: {
      types: [
        DOCUMENTS_ADD_REQUEST, DOCUMENTS_ADD_SUCCESS, DOCUMENTS_ADD_FAILURE,
      ],
      payload: request => request
        .post('/api/documents')
        .set('X-Access-Token', getTokenFromState(getState()))
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
        .set('X-Access-Token', getTokenFromState(getState()))
        .send(values),
      schema: Schemas.DOCUMENT,
    },
  });
}

export function deleteDocument(documentId) {
  return (dispatch, getState) => dispatch({
    [API]: {
      types: [
        DOCUMENT_DELETE_REQUEST,
        DOCUMENT_DELETE_SUCCESS,
        DOCUMENT_DELETE_FAILURE,
      ],
      payload: request => request
        .delete(`/api/documents/${documentId}`)
        .set('X-Access-Token', getTokenFromState(getState())),
    },
    documentId,
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
        .set('X-Access-Token', getTokenFromState(getState())),
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
