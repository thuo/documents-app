import { expect } from 'chai';
import * as actions from 'app/actions/DocumentActions';
import * as types from 'app/actions/ActionTypes';
import mock from '../helpers/mockAgent';
import mockStore from '../helpers/mockStore';

describe('Documents action creators', () => {
  afterEach(() => {
    mock.clearRoutes();
  });

  describe('fetchDocuments()', () => {
    it('dispatches DOCUMENTS_SUCCESS when fetching documents succeeds', () => {
      mock.get('/api/documents', () => ({
        body: ['documents'],
      }));

      const expectedActions = [
        { type: types.DOCUMENTS_REQUEST },
        { type: types.DOCUMENTS_SUCCESS, response: ['documents'] },
      ];
      const store = mockStore({ documents: [] });

      return store.dispatch(actions.fetchDocuments()).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      });
    });

    it('dispatches DOCUMENTS_FAILURE when fetching documents fails', () => {
      mock.get('/api/documents', () => ({
        status: 500,
        response: {
          body: { error: 'error' },
        },
      }));

      const expectedActions = [
        { type: types.DOCUMENTS_REQUEST },
        { type: types.DOCUMENTS_FAILURE, error: { error: 'error' } },
      ];
      const store = mockStore({ documents: [] });

      return store.dispatch(actions.fetchDocuments()).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      });
    });
  });
});
