import request from 'superagent';
import { Schema, arrayOf, normalize } from 'normalizr';

const documentSchema = new Schema('documents', {
  idAttribute: doc => doc._id,
});

const userSchema = new Schema('users', {
  idAttribute: user => user._id,
});

const roleSchema = new Schema('roles', {
  idAttribute: role => role.title,
});

documentSchema.define({
  owner: userSchema,
});

userSchema.define({
  role: roleSchema,
});

export const Schemas = {
  USER: userSchema,
  USER_ARRAY: arrayOf(userSchema),
  DOCUMENT: documentSchema,
  DOCUMENT_ARRAY: arrayOf(documentSchema),
};

export const API = Symbol('API Request');

export default store => next => action => {
  const apiRequest = action[API];

  if (typeof apiRequest === 'undefined') {
    return next(action);
  }

  const { payload, types, schema } = apiRequest;

  if (typeof payload !== 'function') {
    throw new Error('Expected payload to be a function');
  }

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[API];
    return finalAction;
  }

  function normalizeIfPossible(data, dataSchema) {
    if (dataSchema) {
      return normalize(data, dataSchema);
    }
    return data;
  }

  const [requestType, successType, failureType] = types;

  next(actionWith({ type: requestType }));

  const getToken = () => {
    const state = store.getState();
    return state.authenticatedUser && state.authenticatedUser.token;
  };

  const promise = payload(request, getToken);
  if (typeof promise.then !== 'function') {
    throw new Error('Expected payload to return a promise');
  }
  return promise.then(
    response => next(actionWith({
      type: successType,
      response: normalizeIfPossible(response.body, schema),
    })),
    error => next(actionWith({
      type: failureType,
      error: error.response.body,
    }))
  );
};
