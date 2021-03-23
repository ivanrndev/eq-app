import {createStore, applyMiddleware, compose} from 'redux';
import reduxThunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import reducer from './reducers/index';
const logger = createLogger({
  collapsed: true,
  diff: true,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(reduxThunk, logger)),
);
