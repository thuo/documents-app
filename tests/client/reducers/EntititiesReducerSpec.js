import { expect } from 'chai';
import * as types from 'app/actions/ActionTypes';
import entities from 'app/reducers/entities';

describe('Entities reducers', () => {
  const initialState = { documents: {}, users: {}, roles: {} };
  it('returns the initial state', () => {
    expect(entities(undefined, {})).to.eql(initialState);
  });

  it('handles DOCUMENT_DELETE_SUCCESS', () => {
    const state = { users: {}, roles: {}, documents: {
      1: { _id: 1 },
      2: { _id: 2 },
    } };
    expect(entities(state, {
      type: types.DOCUMENT_DELETE_SUCCESS,
      documentId: 1,
    })).to.eql({ users: {}, roles: {}, documents: {
      2: { _id: 2 },
    } });
  });

  it('handles all actions', () => {
    const response = { entities: {
      users: { 1: { _id: 1 } },
      roles: { 1: { _id: 1 } },
      documents: { 1: { _id: 1, title: 'lorem' } },
    } };
    const state = { users: {}, roles: {}, documents: {
      1: { _id: 1, title: 'ipsum' },
      2: { _id: 2 },
    } };
    expect(entities(state, {
      response,
    })).to.eql({
      users: { 1: { _id: 1 } },
      roles: { 1: { _id: 1 } },
      documents: {
        1: { _id: 1, title: 'lorem' },
        2: { _id: 2 },
      },
    });
  });
});
