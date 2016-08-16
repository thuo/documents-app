import { expect } from 'chai';
import * as types from 'app/actions/ActionTypes';
import * as reducers from 'app/reducers/auth';
import { generate } from '../../server/helpers/token';

describe('Auth reducers', () => {
  describe('signUp reducer', () => {
    const initialState = { error: null, loading: false };

    it('returns the initial state', () => {
      expect(reducers.signUp(undefined, {})).to.eql(initialState);
    });

    it('handles SIGN_UP_SUCCESS', () => {
      expect(reducers.signUp({ error: 'error' }, {
        type: types.SIGN_UP_SUCCESS,
        response: { result: 1 },
      })).to.eql({
        error: null,
        loading: false,
      });
    });

    it('handles SIGN_UP_FAILURE', () => {
      const error = { error: 'error' };
      expect(reducers.signUp(initialState, {
        type: types.SIGN_UP_FAILURE,
        error,
      })).to.eql({ error, loading: false });
    });
  });

  describe('logIn reducer', () => {
    const initialState = { error: null, loading: false };

    it('returns the initial state', () => {
      expect(reducers.logIn(undefined, {})).to.eql(initialState);
    });

    it('handles LOGIN_SUCCESS', () => {
      expect(reducers.logIn({ error: 'error' }, {
        type: types.LOGIN_SUCCESS,
        response: { result: 1 },
      })).to.eql({
        error: null,
        loading: false,
      });
    });

    it('handles LOGIN_FAILURE', () => {
      const error = { error: 'error' };
      expect(reducers.logIn(initialState, {
        type: types.LOGIN_FAILURE,
        error,
      })).to.eql({ error, loading: false });
    });
  });

  describe('authenticatedUser reducer', () => {
    const initialState = null;

    it('returns the initial state', () => {
      expect(reducers.authenticatedUser(undefined, {})).to.eql(initialState);
    });

    it('handles LOGIN_SUCCESS', () => {
      const token = generate({ username: 'username' });
      expect(reducers.authenticatedUser({ error: 'error' }, {
        type: types.LOGIN_SUCCESS,
        response: { token },
      })).to.eql({ username: 'username', token });
    });

    it('handles LOGIN_FAILURE', () => {
      const error = { error: 'error' };
      expect(reducers.authenticatedUser(initialState, {
        type: types.LOGIN_FAILURE,
        error,
      })).to.eql(null);
    });

    it('handles LOGOUT', () => {
      expect(reducers.authenticatedUser({ username: 'username' }, {
        type: types.LOGOUT,
      })).to.eql(null);
    });
  });
});
