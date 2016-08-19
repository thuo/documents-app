import { expect } from 'chai';
import * as actions from 'app/actions/AuthActions';
import * as types from 'app/actions/ActionTypes';
import mock from '../helpers/mockAgent';
import mockStore from '../helpers/mockStore';

describe('Auth action creators', () => {
  afterEach(() => {
    mock.clearRoutes();
  });

  describe('signUp()', () => {
    it('dispatches SIGN_UP_SUCCESS when signing up succeeds', () => {
      mock.post('/api/users', () => ({
        body: {
          _id: 1,
          username: 'username',
        },
      }));

      const expectedActions = [
        { type: types.SIGN_UP_REQUEST }, {
          type: types.SIGN_UP_SUCCESS,
          response: {
            result: 1,
            entities: { users: {
              1: {
                _id: 1,
                username: 'username',
              },
            } },
          },
        },
      ];
      const store = mockStore({ signUpError: null });

      return store.dispatch(actions.signUp()).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      });
    });

    it('dispatches SIGN_UP_FAILURE when signing up fails', () => {
      mock.post('/api/users', () => ({
        status: 500,
        response: {
          body: { error: 'error' },
        },
      }));

      const expectedActions = [
        { type: types.SIGN_UP_REQUEST },
        { type: types.SIGN_UP_FAILURE, error: { error: 'error' } },
      ];
      const store = mockStore({ signUpError: null });

      return store.dispatch(actions.signUp()).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      });
    });
  });

  describe('logIn()', () => {
    it('dispatches LOGIN_SUCCESS when login succeeds', () => {
      mock.post('/api/login', () => ({
        body: { token: 'token' },
      }));

      const expectedActions = [
        { type: types.LOGIN_REQUEST },
        { type: types.LOGIN_SUCCESS, response: { token: 'token' } },
      ];
      const store = mockStore({ signUpError: null });

      return store.dispatch(actions.logIn()).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      });
    });

    it('dispatches LOGIN_FAILURE when login fails', () => {
      mock.post('/api/login', () => ({
        status: 401,
        response: {
          body: { error: 'error' },
        },
      }));

      const expectedActions = [
        { type: types.LOGIN_REQUEST },
        { type: types.LOGIN_FAILURE, error: { error: 'error' } },
      ];
      const store = mockStore({ signUpError: null });

      return store.dispatch(actions.logIn()).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      });
    });
  });

  describe('logOut()', () => {
    it('creates LOGOUT', () => {
      const expectedAction = {
        type: types.LOGOUT,
      };
      expect(actions.logOut()).to.eql(expectedAction);
    });
  });
});
