import { API, Schemas } from 'app/middleware/api';
import {
  USER_GET_REQUEST, USER_GET_SUCCESS, USER_GET_FAILURE,
  USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_UPDATE_FAILURE,
  USER_DOCUMENTS_REQUEST, USER_DOCUMENTS_SUCCESS, USER_DOCUMENTS_FAILURE,
} from './ActionTypes';

function fetchUser(userId) {
  return {
    [API]: {
      types: [
        USER_GET_REQUEST, USER_GET_SUCCESS, USER_GET_FAILURE,
      ],
      payload: (request, getToken) => request
        .get(`/api/users/${userId}`)
        .set('X-Access-Token', getToken()),
      schema: Schemas.USER,
    },
  };
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
  return {
    [API]: {
      types: [
        USER_UPDATE_REQUEST,
        USER_UPDATE_SUCCESS,
        USER_UPDATE_FAILURE,
      ],
      payload: (request, getToken) => request
        .put(`/api/users/${userId}`)
        .set('X-Access-Token', getToken())
        .send(values),
      schema: Schemas.USER,
    },
  };
}

export function fetchUsersDocuments(userId) {
  return {
    [API]: {
      types: [
        USER_DOCUMENTS_REQUEST,
        USER_DOCUMENTS_SUCCESS,
        USER_DOCUMENTS_FAILURE,
      ],
      payload: (request, getToken) => request
        .get(`/api/users/${userId}/documents`)
        .set('X-Access-Token', getToken()),
      schema: Schemas.DOCUMENT_ARRAY,
    },
    userId,
  };
}
