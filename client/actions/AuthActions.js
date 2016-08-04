import { API } from 'app/middleware/api';
import humps from 'humps';

import {
  SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE,
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT,
} from './ActionTypes';

export function signUp(user) {
  return {
    [API]: {
      types: [SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE],
      payload: request => request
        .post('/api/users')
        .send(humps.decamelizeKeys(user)),
    },
  };
}

export function logIn(user) {
  return {
    [API]: {
      types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE],
      payload: request => request
        .post('/api/login')
        .send(user),
    },
  };
}

export function logOut() {
  return {
    type: LOGOUT,
  };
}
