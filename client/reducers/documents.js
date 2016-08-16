import {
  DOCUMENTS_REQUEST, DOCUMENTS_SUCCESS, DOCUMENTS_FAILURE,
  DOCUMENTS_ADD_REQUEST, DOCUMENTS_ADD_SUCCESS, DOCUMENTS_ADD_FAILURE,
  DOCUMENT_GET_REQUEST, DOCUMENT_GET_SUCCESS, DOCUMENT_GET_FAILURE,
  DOCUMENT_UPDATE_REQUEST, DOCUMENT_UPDATE_SUCCESS, DOCUMENT_UPDATE_FAILURE,
  DOCUMENT_DELETE_SUCCESS,
  SET_DOCUMENTS_ACCESS_FILTER, SET_DOCUMENTS_SEARCH_FILTER,
} from 'app/actions/ActionTypes';

export function accessFilter(state = '', action) {
  switch (action.type) {
    case SET_DOCUMENTS_ACCESS_FILTER:
      return action.accessFilter;
    default:
      return state;
  }
}

export function searchFilter(state = '', action) {
  switch (action.type) {
    case SET_DOCUMENTS_SEARCH_FILTER:
      return action.searchFilter;
    default:
      return state;
  }
}

const DOCUMENT_LIST_INITIAL_STATE = {
  documents: [],
  error: null,
  loading: false,
  accessFilter: '',
  searchFilter: '',
};

export function documentList(state = DOCUMENT_LIST_INITIAL_STATE, action) {
  switch (action.type) {
    case DOCUMENTS_REQUEST:
      return Object.assign({}, state, {
        documents: [],
        error: null,
        loading: true,
      });
    case DOCUMENTS_SUCCESS:
      return Object.assign({}, state, {
        documents: action.response.result,
        error: null,
        loading: false,
      });
    case DOCUMENTS_FAILURE:
      return Object.assign({}, state, {
        documents: [],
        error: action.error.error,
        loading: false,
      });
    case DOCUMENTS_ADD_SUCCESS:
      return Object.assign({}, state, {
        documents: [action.response.result, ...state.documents],
      });
    case DOCUMENT_DELETE_SUCCESS:
      return Object.assign({}, state, {
        documents: state.documents.filter(id => id !== action.documentId),
      });
    case SET_DOCUMENTS_ACCESS_FILTER:
    case SET_DOCUMENTS_SEARCH_FILTER:
      return Object.assign({}, state, {
        accessFilter: accessFilter(state.accessFilter, action),
        searchFilter: searchFilter(state.searchFilter, action),
      });
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
