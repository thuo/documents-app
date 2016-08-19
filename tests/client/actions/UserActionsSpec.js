import { expect } from 'chai';
import * as actions from 'app/actions/UserActions';
import * as types from 'app/actions/ActionTypes';
import mock from '../helpers/mockAgent';
import mockStore from '../helpers/mockStore';

describe('User actions', () => {
  afterEach(() => {
    mock.clearRoutes();
  });

  describe('fetchUserIfNeeded()', () => {
    const state = { entities: {
      users: { 2: { _id: 2 },
    } } };

    it('does not dispatch any actions if the user is cached', () => {
      const store = mockStore(state);
      return store.dispatch(actions.fetchUserIfNeeded(2)).then(() => {
        expect(store.getActions()).to.eql([]);
      });
    });

    it('dispatches USER_GET_SUCCESS', () => {
      const response = { _id: 1, role: { title: 'user' } };
      mock.get('/api/users/1', () => ({ body: response }));
      const store = mockStore(state);
      const expectedActions = [
        { type: types.USER_GET_REQUEST }, {
          type: types.USER_GET_SUCCESS,
          response: {
            entities: {
              users: { 1: { _id: 1, role: 'user' } },
              roles: { user: { title: 'user' } },
            },
            result: 1,
          },
        },
      ];
      return store.dispatch(actions.fetchUserIfNeeded(1)).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      });
    });

    it('dispatches USER_GET_FAILURE', () => {
      const error = { error: 'error' };
      mock.get('/api/users/1', () => ({
        status: 401,
        response: { body: error },
      }));
      const store = mockStore(state);
      const expectedActions = [
        { type: types.USER_GET_REQUEST },
        { type: types.USER_GET_FAILURE, error },
      ];
      return store.dispatch(actions.fetchUserIfNeeded(1)).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      });
    });
  });

  describe('editUser()', () => {
    it('dispatches USER_UPDATE_SUCCESS', () => {
      const response = { _id: 1, role: { title: 'user' } };
      mock.put('/api/users/1', () => ({ body: response }));
      const store = mockStore({});
      const expectedActions = [
        { type: types.USER_UPDATE_REQUEST }, {
          type: types.USER_UPDATE_SUCCESS,
          response: {
            entities: {
              users: { 1: { _id: 1, role: 'user' } },
              roles: { user: { title: 'user' } },
            },
            result: 1,
          },
        },
      ];
      return store.dispatch(actions.editUser(1)).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      });
    });

    it('dispatches USER_UPDATE_FAILURE', () => {
      const error = { error: 'error' };
      mock.put('/api/users/1', () => ({
        status: 401,
        response: { body: error },
      }));

      const expectedActions = [
        { type: types.USER_UPDATE_REQUEST },
        { type: types.USER_UPDATE_FAILURE, error },
      ];
      const store = mockStore({});
      return store.dispatch(actions.editUser(1)).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      });
    });
  });

  describe('fetchUsersDocuments()', () => {
    it('dispatches USER_DOCUMENTS_SUCCESS', () => {
      mock.get('/api/users/1/documents', () => ({
        body: [
          { _id: 1, title: 'document', owner: {
            _id: 1, username: 'username',
          } },
        ],
      }));

      const expectedActions = [
        { type: types.USER_DOCUMENTS_REQUEST, userId: 1 }, {
          type: types.USER_DOCUMENTS_SUCCESS,
          userId: 1,
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

      return store.dispatch(actions.fetchUsersDocuments(1)).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      });
    });

    it('dispatches USER_DOCUMENTS_FAILURE', () => {
      mock.get('/api/users/1/documents', () => ({
        status: 500,
        response: {
          body: { error: 'error' },
        },
      }));

      const expectedActions = [
        { type: types.USER_DOCUMENTS_REQUEST, userId: 1 },
        { type: types.USER_DOCUMENTS_FAILURE,
          userId: 1,
          error: { error: 'error' },
        },
      ];
      const store = mockStore({ documents: [] });

      return store.dispatch(actions.fetchUsersDocuments(1)).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      });
    });
  });
});
