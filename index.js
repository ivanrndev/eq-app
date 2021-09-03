/**
 * @format
 */
import React from 'react';

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

import {StoreContext} from 'redux-react-hook';
import {Provider} from 'react-redux';
import {store} from './src/store/index';

if (__DEV__) {
  XMLHttpRequest = global.originalXMLHttpRequest
    ? global.originalXMLHttpRequest
    : global.XMLHttpRequest;
}

const ReduxApp = () => (
  <StoreContext.Provider value={store}>
    <Provider store={store}>
      <App />
    </Provider>
  </StoreContext.Provider>
);

AppRegistry.registerComponent(appName, () => ReduxApp);
