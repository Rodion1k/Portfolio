import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../_reducers';
import {createLogger} from 'redux-logger';

const loggerMiddleware = createLogger();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let middleware = [];
middleware = [...middleware, thunkMiddleware, loggerMiddleware];
export const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middleware))
);