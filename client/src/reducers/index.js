import authReducer from './AuthReducer';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    auth: authReducer
});

export default rootReducer;
