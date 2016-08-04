import { expect } from 'chai';
import * as types from 'app/actions/ActionTypes';
import * as reducers from 'app/reducers/documents';

describe('Documents reducers', () => {
  describe('documents reducer', () => {
    const initialState = { list: [], error: null };

    it('returns the initial state', () => {
      expect(reducers.documents(undefined, {})).to.eql(initialState);
    });

    it('handles DOCUMENTS_SUCCESS', () => {
      const response = ['documents'];
      expect(reducers.documents(initialState, {
        type: types.DOCUMENTS_SUCCESS,
        response,
      })).to.eql({ list: response, error: null });
    });

    it('handles DOCUMENTS_FAILURE', () => {
      const error = { error: 'error' };
      expect(reducers.documents({ list: [], error: null }, {
        type: types.DOCUMENTS_FAILURE,
        error,
      })).to.eql({ list: [], error: 'error' });
    });

    it('handles DOCUMENTS_ADD_SUCCESS', () => {
      const response = { title: 'document' };
      const state = { list: [{ title: 'one' }], error: null };
      expect(reducers.documents(state, {
        type: types.DOCUMENTS_ADD_SUCCESS,
        response,
      })).to.eql({
        list: [response, ...state.list],
        error: state.error,
      });
    });
  });

  describe('addDocumentError reducer', () => {
    const initialState = null;

    it('returns the initial state', () => {
      expect(reducers.addDocumentError(undefined, {})).to.eql(initialState);
    });

    it('handles DOCUMENTS_ADD_SUCCESS', () => {
      expect(reducers.addDocumentError(initialState, {
        type: types.DOCUMENTS_ADD_SUCCESS,
      })).to.eql(null);
    });

    it('handles DOCUMENTS_ADD_FAILURE', () => {
      const error = { error: 'error' };
      expect(reducers.addDocumentError(null, {
        type: types.DOCUMENTS_ADD_FAILURE,
        error,
      })).to.eql(error);
    });
  });
});
