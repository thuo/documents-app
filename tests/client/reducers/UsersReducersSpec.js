import { expect } from 'chai';
import * as types from 'app/actions/ActionTypes';
import * as reducers from 'app/reducers/users';

describe('Users reducers', () => {
  describe('userPage', () => {
    const initialState = { user: null, error: null, loading: false };
    it('returns the initial state', () => {
      expect(reducers.userPage(undefined, {})).to.eql(initialState);
    });

    it('handles USER_GET_REQUEST', () => {
      expect(reducers.userPage(initialState, {
        type: types.USER_GET_REQUEST,
      })).to.eql({ user: null, error: null, loading: true });
    });

    it('handles USER_GET_SUCCESS', () => {
      const response = { result: 1 };
      expect(reducers.userPage(initialState, {
        type: types.USER_GET_SUCCESS,
        response,
      })).to.eql({ user: 1, error: null, loading: false });
    });

    it('handles USER_GET_FAILURE', () => {
      const error = { error: 'error' };
      expect(reducers.userPage({ user: null, error: null, loading: true }, {
        type: types.USER_GET_FAILURE,
        error,
      })).to.eql({
        user: null, error, loading: false,
      });
    });
  });

  describe('editProfile', () => {
    const initialState = { error: null, loading: false };
    it('returns the initial state', () => {
      expect(reducers.editProfile(undefined, {})).to.eql(initialState);
    });

    it('handles USER_UPDATE_REQUEST', () => {
      expect(reducers.editProfile(initialState, {
        type: types.USER_UPDATE_REQUEST,
      })).to.eql({ error: null, loading: true });
    });

    it('handles USER_UPDATE_SUCCESS', () => {
      const response = { result: 1 };
      expect(reducers.editProfile(initialState, {
        type: types.USER_UPDATE_SUCCESS,
        response,
      })).to.eql({ error: null, loading: false });
    });

    it('handles USER_UPDATE_FAILURE', () => {
      const error = { error: 'error' };
      expect(reducers.editProfile({ user: null, error: null, loading: true }, {
        type: types.USER_UPDATE_FAILURE,
        error,
      })).to.eql({
        error, loading: false,
      });
    });
  });

  describe('documentsByUser', () => {
    it('returns the initial state', () => {
      expect(reducers.documentsByUser(undefined, {})).to.eql({});
    });

    it('handles USER_DOCUMENTS_REQUEST', () => {
      expect(reducers.documentsByUser({}, {
        type: types.USER_DOCUMENTS_REQUEST,
        userId: 1,
      })).to.eql({ 1: { documents: [], error: null, loading: true } });
    });

    it('handles USER_DOCUMENTS_SUCCESS', () => {
      const response = { result: [1, 2] };
      expect(reducers.documentsByUser({}, {
        type: types.USER_DOCUMENTS_SUCCESS,
        response,
        userId: 2,
      })).to.eql({ 2: { documents: [1, 2], error: null, loading: false } });
    });

    it('handles USER_DOCUMENTS_FAILURE', () => {
      const error = { error: 'error' };
      expect(reducers.documentsByUser({
        1: { documents: [], error: null, loading: true },
      }, {
        type: types.USER_DOCUMENTS_FAILURE,
        error,
        userId: 1,
      })).to.eql({
        1: { documents: [], error, loading: false },
      });
    });
  });
});
