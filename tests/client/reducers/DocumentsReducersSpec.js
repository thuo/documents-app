import { expect } from 'chai';
import * as types from 'app/actions/ActionTypes';
import * as reducers from 'app/reducers/documents';

describe('Documents reducers', () => {
  describe('documentList reducer', () => {
    const initialState = {
      documents: [], error: null, loading: false,
      accessFilter: '', searchFilter: '',
    };
    it('returns the initial state', () => {
      expect(reducers.documentList(undefined, {})).to.eql(initialState);
    });

    it('handles DOCUMENTS_REQUEST', () => {
      expect(reducers.documentList(initialState, {
        type: types.DOCUMENTS_REQUEST,
      })).to.eql({
        documents: [], error: null, loading: true,
        accessFilter: '', searchFilter: '',
      });
    });

    it('handles DOCUMENTS_SUCCESS', () => {
      const response = { result: [1] };
      expect(reducers.documentList(initialState, {
        type: types.DOCUMENTS_SUCCESS,
        response,
      })).to.eql({
        documents: response.result, error: null, loading: false,
        accessFilter: '', searchFilter: '',
      });
    });

    it('handles DOCUMENTS_FAILURE', () => {
      const error = { error: 'error' };
      expect(reducers.documentList({
        documents: [], error: null, loading: false,
      }, {
        type: types.DOCUMENTS_FAILURE,
        error,
      })).to.eql({
        documents: [], error: 'error', loading: false,
      });
    });

    it('handles DOCUMENTS_ADD_SUCCESS', () => {
      const response = { result: 1 };
      const state = {
        documents: [1], error: null, loading: false,
        accessFilter: '', searchFilter: '',
      };
      expect(reducers.documentList(state, {
        type: types.DOCUMENTS_ADD_SUCCESS,
        response,
      })).to.eql({
        documents: [response.result, ...state.documents],
        error: state.error,
        loading: state.loading,
        accessFilter: '', searchFilter: '',
      });
    });

    it('handles DOCUMENT_DELETE_SUCCESS', () => {
      const state = {
        documents: [1, 2],
        error: null,
        loading: false,
        accessFilter: '',
        searchFilter: '',
      };
      expect(reducers.documentList(state, {
        type: types.DOCUMENT_DELETE_SUCCESS,
        documentId: 2,
      })).to.eql({
        documents: [1],
        error: state.error,
        loading: state.loading,
        accessFilter: '',
        searchFilter: '',
      });
    });

    it('handles SET_DOCUMENTS_SEARCH_FILTER', () => {
      const state = {
        documents: [1],
        error: null,
        loading: false,
        accessFilter: '',
        searchFilter: '',
      };
      expect(reducers.documentList(state, {
        type: types.SET_DOCUMENTS_SEARCH_FILTER,
        searchFilter: 'lorem',
      })).to.eql({
        documents: [1],
        error: state.error,
        loading: state.loading,
        accessFilter: '',
        searchFilter: 'lorem',
      });
    });

    it('handles SET_DOCUMENTS_ACCESS_FILTER', () => {
      const state = {
        documents: [1],
        error: null,
        loading: false,
        accessFilter: '',
        searchFilter: '',
      };
      expect(reducers.documentList(state, {
        type: types.SET_DOCUMENTS_ACCESS_FILTER,
        accessFilter: 'private',
      })).to.eql({
        documents: [1],
        error: state.error,
        loading: state.loading,
        accessFilter: 'private',
        searchFilter: '',
      });
    });
  });

  describe('addDocument', () => {
    const initialState = { document: null, error: null, loading: false };

    it('returns the initial state', () => {
      expect(reducers.addDocument(undefined, {})).to.eql(initialState);
    });

    it('handles DOCUMENTS_ADD_REQUEST', () => {
      expect(reducers.addDocument(initialState, {
        type: types.DOCUMENTS_ADD_REQUEST,
      })).to.eql({ error: null, loading: true, document: null });
    });

    it('handles DOCUMENTS_ADD_SUCCESS', () => {
      const response = { result: 1 };
      expect(reducers.addDocument(initialState, {
        type: types.DOCUMENTS_ADD_SUCCESS,
        response,
      })).to.eql({ error: null, loading: false, document: response.result });
    });

    it('handles DOCUMENTS_ADD_FAILURE', () => {
      const error = { error: 'error' };
      expect(reducers.addDocument({ error: null }, {
        type: types.DOCUMENTS_ADD_FAILURE,
        error,
      })).to.eql({ error, loading: false, document: null });
    });
  });

  describe('documentPage', () => {
    const initialState = { document: null, error: null, loading: false };

    it('returns the initial state', () => {
      expect(reducers.documentPage(undefined, {})).to.eql(initialState);
    });

    it('handles DOCUMENT_GET_REQUEST', () => {
      expect(reducers.documentPage(initialState, {
        type: types.DOCUMENT_GET_REQUEST,
      })).to.eql({ error: null, loading: true, document: null });
    });

    it('handles DOCUMENT_GET_SUCCESS', () => {
      const response = { result: 1 };
      expect(reducers.documentPage(initialState, {
        type: types.DOCUMENT_GET_SUCCESS,
        response,
      })).to.eql({ error: null, loading: false, document: response.result });
    });

    it('handles DOCUMENT_GET_FAILURE', () => {
      const error = { error: 'error' };
      expect(reducers.documentPage({ error: null }, {
        type: types.DOCUMENT_GET_FAILURE,
        error,
      })).to.eql({ error, loading: false, document: null });
    });
  });

  describe('editDocument', () => {
    const initialState = { error: null, loading: false };

    it('returns the initial state', () => {
      expect(reducers.editDocument(undefined, {})).to.eql(initialState);
    });

    it('handles DOCUMENT_UPDATE_REQUEST', () => {
      expect(reducers.editDocument(initialState, {
        type: types.DOCUMENT_UPDATE_REQUEST,
      })).to.eql({ error: null, loading: true });
    });

    it('handles DOCUMENT_UPDATE_SUCCESS', () => {
      const response = { result: 1 };
      expect(reducers.editDocument(initialState, {
        type: types.DOCUMENT_UPDATE_SUCCESS,
        response,
      })).to.eql({ error: null, loading: false });
    });

    it('handles DOCUMENT_UPDATE_FAILURE', () => {
      const error = { error: 'error' };
      expect(reducers.editDocument({ error: null }, {
        type: types.DOCUMENT_UPDATE_FAILURE,
        error,
      })).to.eql({ error, loading: false });
    });
  });
});
