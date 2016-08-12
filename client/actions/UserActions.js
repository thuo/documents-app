import { API, Schemas } from 'app/middleware/api';
import getTokenFromState from 'app/utils/getTokenFromState';
import {
  USER_GET_REQUEST, USER_GET_SUCCESS, USER_GET_FAILURE,
  USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_UPDATE_FAILURE,
} from './ActionTypes';

function fetchUser(userId) {
  return (dispatch, getState) => dispatch({
    [API]: {
      types: [
        USER_GET_REQUEST, USER_GET_SUCCESS, USER_GET_FAILURE,
      ],
      payload: request => request
        .get(`/api/users/${userId}`)
        .set('X-Access-Token', getTokenFromState(getState())),
      schema: Schemas.USER,
    },
  });
}

function shouldFetchUser(state, userId) {
  return !state.entities.users[userId];
}

export function fetchUserIfNeeded(userId) {
  return (dispatch, getState) => {
    if (shouldFetchUser(getState(), userId)) {
      return dispatch(fetchUser(userId));
    }
    return Promise.resolve();
  };
}

export function editUser(userId, values) {
  return (dispatch, getState) => dispatch({
    [API]: {
      types: [
        USER_UPDATE_REQUEST,
        USER_UPDATE_SUCCESS,
        USER_UPDATE_FAILURE,
      ],
      payload: request => request
        .put(`/api/users/${userId}`)
        .set('X-Access-Token', getTokenFromState(getState()))
        .send(values),
      schema: Schemas.USER,
    },
  });
}
