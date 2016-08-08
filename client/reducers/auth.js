import {
  SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE,
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT,
} from 'app/actions/ActionTypes';
import getUserFromToken from 'app/utils/getUserFromToken';

export function signUp(state = { loading: false, error: null }, action) {
  switch (action.type) {
    case SIGN_UP_REQUEST:
      return {
        loading: true,
        error: null,
      };
    case SIGN_UP_SUCCESS:
      return {
        loading: false,
        error: null,
      };
    case SIGN_UP_FAILURE:
      return {
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
}

export function logIn(state = { loading: false, error: null }, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        loading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
      return {
        loading: false,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
}

export function authenticatedUser(state = null, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return getUserFromToken(action.response.token);
    case LOGIN_FAILURE:
    case LOGOUT:
      return null;
    default:
      return state;
  }
}
