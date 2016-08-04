import { expect } from 'chai';
import * as types from 'app/actions/ActionTypes';
import { documents } from 'app/reducers/documents';

describe('Documents reducer', () => {
  const initialState = { list: [], error: null };

  it('returns the initial state', () => {
    expect(documents(undefined, {})).to.eql(initialState);
  });

  it('handles DOCUMENTS_SUCCESS', () => {
    expect(documents(initialState, {
      type: types.DOCUMENTS_SUCCESS,
      response: ['documents'],
    })).to.eql({ list: ['documents'], error: null });
  });

  it('handles DOCUMENTS_FAILURE', () => {
    expect(documents({ list: [], error: null }, {
      type: types.DOCUMENTS_FAILURE,
      error: { error: 'error' },
    })).to.eql({ list: [], error: 'error' });
  });
});
