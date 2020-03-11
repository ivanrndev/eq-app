import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'

import createSagaMiddleware from 'redux-saga'

import reducer from './reducers/index'

import sagas from './sagas'

const sagaMiddleware = createSagaMiddleware()

export const store = createStore(reducer, composeWithDevTools(applyMiddleware(sagaMiddleware)))


sagaMiddleware.run(sagas)
