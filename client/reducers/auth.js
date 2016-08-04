import {
  SIGN_UP_SUCCESS, SIGN_UP_FAILURE,
  LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT,
} from 'app/actions/ActionTypes';
import getUserFromToken from 'app/utils/getUserFromToken';

export function signUpError(state = null, action) {
  switch (action.type) {
    case SIGN_UP_SUCCESS:
      return null;
    case SIGN_UP_FAILURE:
      return action.error;
    default:
      return state;
  }
}

export function loginError(state = null, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return null;
    case LOGIN_FAILURE:
      return action.error.error;
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
