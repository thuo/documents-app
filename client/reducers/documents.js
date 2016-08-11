import {
  DOCUMENTS_REQUEST, DOCUMENTS_SUCCESS, DOCUMENTS_FAILURE,
  DOCUMENTS_ADD_REQUEST, DOCUMENTS_ADD_SUCCESS, DOCUMENTS_ADD_FAILURE,
  DOCUMENT_GET_REQUEST, DOCUMENT_GET_SUCCESS, DOCUMENT_GET_FAILURE,
  DOCUMENT_UPDATE_REQUEST, DOCUMENT_UPDATE_SUCCESS, DOCUMENT_UPDATE_FAILURE,
  DOCUMENT_DELETE_SUCCESS,
} from 'app/actions/ActionTypes';

export function documentList(state = { documents: [], error: null,
  loading: false }, action) {
  switch (action.type) {
    case DOCUMENTS_REQUEST:
      return {
        documents: [],
        error: null,
        loading: true,
      };
    case DOCUMENTS_SUCCESS:
      return {
        documents: action.response.result,
        error: null,
        loading: false,
      };
    case DOCUMENTS_FAILURE:
      return {
        documents: [],
        error: action.error.error,
        loading: false,
      };
    case DOCUMENTS_ADD_SUCCESS:
      return {
        documents: [action.response.result, ...state.documents],
        error: state.error,
        loading: state.loading,
      };
    case DOCUMENT_DELETE_SUCCESS:
      return {
        documents: state.documents.filter(id => id !== action.documentId),
        error: state.error,
        loading: state.loading,
      };
    default:
      return state;
  }
}

export function addDocument(state = { error: null, loading: false,
  document: null }, action) {
  switch (action.type) {
    case DOCUMENTS_ADD_REQUEST:
      return {
        error: null,
        loading: true,
        addDocument: null,
      };
    case DOCUMENTS_ADD_SUCCESS:
      return {
        error: null,
        loading: false,
        document: action.response.result,
      };
    case DOCUMENTS_ADD_FAILURE:
      return {
        error: action.error,
        loading: false,
        document: null,
      };
    default:
      return state;
  }
}

export function documentPage(state = { document: null, error: null,
  loading: false }, action) {
  switch (action.type) {
    case DOCUMENT_GET_REQUEST:
      return {
        document: null,
        error: null,
        loading: true,
      };
    case DOCUMENT_GET_SUCCESS:
      return {
        document: action.response.result,
        error: null,
        loading: false,
      };
    case DOCUMENT_GET_FAILURE:
      return {
        document: null,
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
}

export function editDocument(state = { error: null, loading: false }, action) {
  switch (action.type) {
    case DOCUMENT_UPDATE_REQUEST:
      return {
        error: null,
        loading: true,
      };
    case DOCUMENT_UPDATE_SUCCESS:
      return {
        error: null,
        loading: false,
      };
    case DOCUMENT_UPDATE_FAILURE:
      return {
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
}
