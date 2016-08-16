import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import api from 'app/middleware/api';

const middleware = [thunk, api];
export default configureMockStore(middleware);
