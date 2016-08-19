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
      const store = mockStore({});

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
      const store = mockStore({});
      return store.dispatch(actions.addDocument()).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      });
    });
  });

  describe('editDocument()', () => {
    it('dispatches DOCUMENT_UPDATE_SUCCESS', () => {
      const response = { _id: 1, owner: { _id: 1 } };
      mock.put('/api/documents/1', () => ({ body: response }));
      const store = mockStore({});
      const expectedActions = [
        { type: types.DOCUMENT_UPDATE_REQUEST }, {
          type: types.DOCUMENT_UPDATE_SUCCESS,
          response: {
            entities: {
              documents: { 1: { _id: 1, owner: 1 } },
              users: { 1: { _id: 1 } },
            },
            result: 1,
          },
        },
      ];
      return store.dispatch(actions.editDocument(1)).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      });
    });

    it('dispatches DOCUMENT_UPDATE_FAILURE', () => {
      const error = { error: 'error' };
      mock.put('/api/documents/1', () => ({
        status: 401,
        response: { body: error },
      }));

      const expectedActions = [
        { type: types.DOCUMENT_UPDATE_REQUEST },
        { type: types.DOCUMENT_UPDATE_FAILURE, error },
      ];
      const store = mockStore({});
      return store.dispatch(actions.editDocument(1)).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      });
    });
  });

  describe('deleteDocument()', () => {
    it('dispatches DOCUMENT_DELETE_SUCCESS', () => {
      const response = { message: 'success' };
      mock.del('/api/documents/1', () => ({ body: response }));
      const store = mockStore({});
      const expectedActions = [
        { type: types.DOCUMENT_DELETE_REQUEST, documentId: 1 }, {
          type: types.DOCUMENT_DELETE_SUCCESS,
          documentId: 1,
          response,
        },
      ];
      return store.dispatch(actions.deleteDocument(1)).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      });
    });

    it('dispatches DOCUMENTS_DELETE_FAILURE', () => {
      const error = { error: 'error' };
      mock.del('/api/documents/1', () => ({
        status: 401,
        response: { body: error },
      }));

      const expectedActions = [
        { type: types.DOCUMENT_DELETE_REQUEST, documentId: 1 },
        { type: types.DOCUMENT_DELETE_FAILURE, documentId: 1, error },
      ];
      const store = mockStore({});
      return store.dispatch(actions.deleteDocument(1)).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      });
    });
  });

  describe('fetchDocumentIfNeeded()', () => {
    const state = { entities: {
      documents: { 2: { _id: 2 },
    } } };

    it('does not dispatch any actions if the document is cached', () => {
      const store = mockStore(state);
      return store.dispatch(actions.fetchDocumentIfNeeded(2)).then(() => {
        expect(store.getActions()).to.eql([]);
      });
    });

    it('dispatches DOCUMENT_GET_SUCCESS', () => {
      const response = { _id: 1, owner: { _id: 1 } };
      mock.get('/api/documents/1', () => ({ body: response }));
      const store = mockStore(state);
      const expectedActions = [
        { type: types.DOCUMENT_GET_REQUEST }, {
          type: types.DOCUMENT_GET_SUCCESS,
          response: {
            entities: {
              documents: { 1: { _id: 1, owner: 1 } },
              users: { 1: { _id: 1 } },
            },
            result: 1,
          },
        },
      ];
      return store.dispatch(actions.fetchDocumentIfNeeded(1)).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      });
    });

    it('dispatches DOCUMENTS_GET_FAILURE', () => {
      const error = { error: 'error' };
      mock.get('/api/documents/1', () => ({
        status: 401,
        response: { body: error },
      }));
      const store = mockStore(state);
      const expectedActions = [
        { type: types.DOCUMENT_GET_REQUEST },
        { type: types.DOCUMENT_GET_FAILURE, error },
      ];
      return store.dispatch(actions.fetchDocumentIfNeeded(1)).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      });
    });
  });

  describe('setDocumentsSearchFilter()', () => {
    it('creates SET_DOCUMENTS_SEARCH_FILTER', () => {
      expect(actions.setDocumentsSearchFilter('lorem')).eql({
        type: types.SET_DOCUMENTS_SEARCH_FILTER,
        searchFilter: 'lorem',
      });
    });
  });

  describe('setDocumentsAccessFilter()', () => {
    it('creates SET_DOCUMENTS_ACCESS_FILTER', () => {
      expect(actions.setDocumentsAccessFilter('public')).eql({
        type: types.SET_DOCUMENTS_ACCESS_FILTER,
        accessFilter: 'public',
      });
    });
  });
});
