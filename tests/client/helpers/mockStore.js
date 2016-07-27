import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as api from 'app/middleware/api';

const middleware = [thunk, api.default];
export default configureMockStore(middleware);
