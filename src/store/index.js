import {createStore, applyMiddleware, compose} from 'redux';
import reduxThunk from 'redux-thunk';
import reducer from './reducers/index';
import {createLogger} from 'redux-logger';

const logger = createLogger({
  collapsed: true,
  diff: true,
});

export const store = createStore(
  reducer,
  compose(applyMiddleware(reduxThunk, logger)),
);
