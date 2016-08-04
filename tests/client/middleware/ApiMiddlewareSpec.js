import { expect } from 'chai';
import sinon from 'sinon';
import mockStore from '../helpers/mockStore';
import * as api from 'app/middleware/api';

describe('API middleware', () => {
  it('throws error if payload is not a function', () => {
    const action = {
      [api.API]: {
        types: ['TEST_REQUEST', 'TEST_SUCCESS', 'TEST_FAILURE'],
        payload: Promise.resolve({
          body: ['documents'],
        }),
      },
    };
    const store = mockStore({ documents: [] });
    expect(
      () => store.dispatch(action)
    ).to.throw('Expected payload to be a function');
  });

  it('throws error if payload is doesn\'t return a promise', () => {
    const action = {
      [api.API]: {
        types: ['TEST_REQUEST', 'TEST_SUCCESS', 'TEST_FAILURE'],
        payload: () => ({
          body: ['documents'],
        }),
      },
    };
    const store = mockStore({ documents: [] });
    expect(
      () => store.dispatch(action)
    ).to.throw('Expected payload to return a promise');
  });

  it('dispatches the success action when the payload succeeds', () => {
    const action = {
      [api.API]: {
        types: ['TEST_REQUEST', 'TEST_SUCCESS', 'TEST_FAILURE'],
        payload: () => Promise.resolve({
          body: ['documents'],
        }),
      },
    };
    const apiRequest = action[api.API];
    sinon.spy(apiRequest, 'payload');
    const expectedActions = [
      { type: apiRequest.types[0] },
      { type: apiRequest.types[1], response: ['documents'] },
    ];
    const store = mockStore({ documents: [] });

    return store.dispatch(action).then(() => {
      expect(apiRequest.payload.calledOnce).to.be.true;
      expect(store.getActions()).to.eql(expectedActions);
    });
  });

  it('dispatches the failed action when the payload fails', () => {
    const action = {
      [api.API]: {
        types: ['TEST_REQUEST', 'TEST_SUCCESS', 'TEST_FAILURE'],
        payload: () => Promise.reject({
          response: { body: {
            error: 'Oops!',
          } },
        }),
      },
    };
    const apiRequest = action[api.API];
    sinon.spy(apiRequest, 'payload');
    const expectedActions = [
      { type: apiRequest.types[0] },
      { type: apiRequest.types[2], error: { error: 'Oops!' } },
    ];
    const store = mockStore({ documents: [] });

    return store.dispatch(action).then(() => {
      expect(apiRequest.payload.calledOnce).to.be.true;
      expect(store.getActions()).to.eql(expectedActions);
    });
  });
});
