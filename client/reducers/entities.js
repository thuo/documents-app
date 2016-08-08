import merge from 'lodash/merge';

const initialState = { documents: {}, users: {}, roles: {} };

export default function entities(state = initialState, action) {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities);
  }
  return state;
}
