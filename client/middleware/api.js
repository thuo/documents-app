import request from 'superagent';

export const API = Symbol('API Request');

export default () => next => action => {
  const apiRequest = action[API];

  if (typeof apiRequest === 'undefined') {
    return next(action);
  }

  const { payload, types } = apiRequest;

  if (typeof payload !== 'function') {
    throw new Error('Expected payload to be a function');
  }

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[API];
    return finalAction;
  }

  const [requestType, successType, failureType] = types;

  next(actionWith({ type: requestType }));

  const promise = payload(request);
  if (typeof promise.then !== 'function') {
    throw new Error('Expected payload to return a promise');
  }
  return promise.then(
    response => next(actionWith({
      type: successType,
      response: response.body,
    })),
    error => next(actionWith({
      type: failureType,
      error: error.response.body,
    }))
  );
};
