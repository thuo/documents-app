import {
  USER_GET_REQUEST, USER_GET_SUCCESS, USER_GET_FAILURE,
  USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_UPDATE_FAILURE,
} from 'app/actions/ActionTypes';

export function userPage(state = { user: null, error: null,
  loading: false }, action) {
  switch (action.type) {
    case USER_GET_REQUEST:
      return {
        user: null,
        error: null,
        loading: true,
      };
    case USER_GET_SUCCESS:
      return {
        user: action.response.result,
        error: null,
        loading: false,
      };
    case USER_GET_FAILURE:
      return {
        user: null,
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
}

export function editProfile(state = { error: null, loading: false }, action) {
  switch (action.type) {
    case USER_UPDATE_REQUEST:
      return {
        error: null,
        loading: true,
      };
    case USER_UPDATE_SUCCESS:
      return {
        error: null,
        loading: false,
      };
    case USER_UPDATE_FAILURE:
      return {
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
}