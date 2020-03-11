import React from 'react';
import {StatusBar} from 'react-native';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';

// navigation and router
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NativeRouter} from 'react-router-native';

// store
import {StoreContext} from 'redux-react-hook';
import {store} from './store';

// components
import Main from './screens/Main';
import Auth from './screens/Auth';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3a6fdb',
    accent: '#f1c40f',
  },
};

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <StoreContext.Provider value={store}>
      <NavigationContainer>
        <NativeRouter>
          <PaperProvider theme={theme}>
            <StatusBar barStyle="light-content" backgroundColor="#3a6fdb" />
            <Drawer.Navigator initialRouteName="Auth">
              <Drawer.Screen name="Home" component={Main} />
              <Drawer.Screen name="Auth" component={Auth} />
            </Drawer.Navigator>
          </PaperProvider>
        </NativeRouter>
      </NavigationContainer>
    </StoreContext.Provider>
  );
};

export default App;
