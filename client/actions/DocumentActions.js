import { API, Schemas } from 'app/middleware/api';
import {
  DOCUMENTS_REQUEST, DOCUMENTS_SUCCESS, DOCUMENTS_FAILURE,
  DOCUMENTS_ADD_REQUEST, DOCUMENTS_ADD_SUCCESS, DOCUMENTS_ADD_FAILURE,
  DOCUMENT_GET_REQUEST, DOCUMENT_GET_SUCCESS, DOCUMENT_GET_FAILURE,
  DOCUMENT_UPDATE_REQUEST, DOCUMENT_UPDATE_SUCCESS, DOCUMENT_UPDATE_FAILURE,
  DOCUMENT_DELETE_REQUEST, DOCUMENT_DELETE_SUCCESS, DOCUMENT_DELETE_FAILURE,
  SET_DOCUMENTS_SEARCH_FILTER, SET_DOCUMENTS_ACCESS_FILTER,
} from './ActionTypes';

export function fetchDocuments() {
  return {
    [API]: {
      types: [DOCUMENTS_REQUEST, DOCUMENTS_SUCCESS, DOCUMENTS_FAILURE],
      payload: (request, getToken) => request
        .get('/api/documents')
        .set('X-Access-Token', getToken()),
      schema: Schemas.DOCUMENT_ARRAY,
    },
  };
}

export function addDocument(doc) {
  return {
    [API]: {
      types: [
        DOCUMENTS_ADD_REQUEST, DOCUMENTS_ADD_SUCCESS, DOCUMENTS_ADD_FAILURE,
      ],
      payload: (request, getToken) => request
        .post('/api/documents')
        .set('X-Access-Token', getToken())
        .send(doc),
      schema: Schemas.DOCUMENT,
    },
  };
}

export function editDocument(documentId, values) {
  return {
    [API]: {
      types: [
        DOCUMENT_UPDATE_REQUEST,
        DOCUMENT_UPDATE_SUCCESS,
        DOCUMENT_UPDATE_FAILURE,
      ],
      payload: (request, getToken) => request
        .put(`/api/documents/${documentId}`)
        .set('X-Access-Token', getToken())
        .send(values),
      schema: Schemas.DOCUMENT,
    },
  };
}

export function deleteDocument(documentId) {
  return {
    [API]: {
      types: [
        DOCUMENT_DELETE_REQUEST,
        DOCUMENT_DELETE_SUCCESS,
        DOCUMENT_DELETE_FAILURE,
      ],
      payload: (request, getToken) => request
        .del(`/api/documents/${documentId}`)
        .set('X-Access-Token', getToken()),
    },
    documentId,
  };
}

function fetchDocument(documentId) {
  return {
    [API]: {
      types: [
        DOCUMENT_GET_REQUEST, DOCUMENT_GET_SUCCESS, DOCUMENT_GET_FAILURE,
      ],
      payload: (request, getToken) => request
        .get(`/api/documents/${documentId}`)
        .set('X-Access-Token', getToken()),
      schema: Schemas.DOCUMENT,
    },
  };
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

export function setDocumentsAccessFilter(accessFilter) {
  return {
    type: SET_DOCUMENTS_ACCESS_FILTER,
    accessFilter,
  };
}

export function setDocumentsSearchFilter(searchFilter) {
  return {
    type: SET_DOCUMENTS_SEARCH_FILTER,
    searchFilter,
  };
}
