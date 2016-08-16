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
  });

  describe('addDocument', () => {
    const initialState = { document: null, error: null, loading: false };

    it('returns the initial state', () => {
      expect(reducers.addDocument(undefined, {})).to.eql(initialState);
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
});
