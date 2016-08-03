import { expect } from 'chai';
import * as types from 'app/actions/ActionTypes';
import * as reducers from 'app/reducers/auth';
import { generate } from '../../server/helpers/token';

describe('Auth reducers', () => {
  describe('signUpError reducer', () => {
    const initialState = null;

    it('returns the initial state', () => {
      expect(reducers.signUpError(undefined, {})).to.eql(initialState);
    });

    it('handles SIGN_UP_SUCCESS', () => {
      expect(reducers.signUpError({ error: 'error' }, {
        type: types.SIGN_UP_SUCCESS,
        response: { username: 'username' },
      })).to.eql(null);
    });

    it('handles SIGN_UP_FAILURE', () => {
      expect(reducers.signUpError(initialState, {
        type: types.SIGN_UP_FAILURE,
        error: { error: 'error' },
      })).to.eql({ error: 'error' });
    });
  });

  describe('loginError reducer', () => {
    const initialState = null;

    it('returns the initial state', () => {
      expect(reducers.loginError(undefined, {})).to.eql(initialState);
    });

    it('handles LOGIN_SUCCESS', () => {
      expect(reducers.loginError({ error: 'error' }, {
        type: types.LOGIN_SUCCESS,
        response: { username: 'username' },
      })).to.eql(null);
    });

    it('handles LOGIN_FAILURE', () => {
      expect(reducers.loginError(initialState, {
        type: types.LOGIN_FAILURE,
        error: { error: 'error' },
      })).to.eql('error');
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
      expect(reducers.authenticatedUser(initialState, {
        type: types.LOGIN_FAILURE,
        error: { error: 'error' },
      })).to.eql(null);
    });

    it('handles LOGOUT', () => {
      expect(reducers.authenticatedUser({ username: 'username' }, {
        type: types.LOGOUT,
      })).to.eql(null);
    });
  });
});
