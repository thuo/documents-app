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
        body: [
          { _id: 1, title: 'document', owner: {
            _id: 1, username: 'username',
          } },
        ],
      }));

      const expectedActions = [
        { type: types.DOCUMENTS_REQUEST }, {
          type: types.DOCUMENTS_SUCCESS,
          response: { entities: {
            documents: { 1: {
              _id: 1,
              owner: 1,
              title: 'document',
            } },
            users: { 1: {
              _id: 1,
              username: 'username',
            } },
          }, result: [1] },
        },
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

  describe('addDocument()', () => {
    it('dispatches DOCUMENTS_ADD_SUCCESS when adding document succeeds', () => {
      const response = { _id: 1, title: 'document', owner: {
        _id: 1, username: 'username',
      } };
      mock.post('/api/documents', () => ({
        body: response,
      }));

      const expectedActions = [
        { type: types.DOCUMENTS_ADD_REQUEST }, {
          type: types.DOCUMENTS_ADD_SUCCESS,
          response: { entities: {
            documents: { 1: {
              _id: 1,
              owner: 1,
              title: 'document',
            } },
            users: { 1: {
              _id: 1,
              username: 'username',
            } },
          }, result: 1 },
        },
      ];
      const store = mockStore({
        authenticatedUser: {
          token: 'token',
        },
      });

      return store.dispatch(actions.addDocument()).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      });
    });

    it('dispatches DOCUMENTS_ADD_FAILURE when addding document fails', () => {
      const error = { error: 'error' };
      mock.post('/api/documents', () => ({
        status: 401,
        response: {
          body: error,
        },
      }));

      const expectedActions = [
        { type: types.DOCUMENTS_ADD_REQUEST },
        { type: types.DOCUMENTS_ADD_FAILURE, error },
      ];
      const store = mockStore({
        authenticatedUser: {
          token: 'token',
        },
      });
      return store.dispatch(actions.addDocument()).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      });
    });
  });
});
