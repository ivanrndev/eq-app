import React from 'react';
import {StatusBar} from 'react-native';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';

// navigation and router
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NativeRouter} from 'react-router-native';

// store
// import {StoreContext} from 'redux-react-hook';
import {Provider} from 'react-redux';
import {store} from './store';

// components
import Main from './screens/Main';
import Auth from './screens/Auth';
import Ident from './screens/Ident';
import IdentInfo from './screens/Ident/IdentInfo';
import Service from './screens/Service/';
import ServiceInfo from './screens/Service/ServiceInfo';
import ServiceFinish from './screens/Service/ServiceFinish';
import WriteOff from './screens/WriteOff/';
import WriteOffInfo from './screens/WriteOff/WriteOffInfo';
import WriteOffFinish from './screens/WriteOff/WriteOffFinish';
import Marking from './screens/Marking/';
import MarkingList from './screens/Marking/MarkingList';
import MarkingScaner from './screens/Marking/MarkingScaner';
import MarkingFinish from './screens/Marking/MarkingFinish';
import OnMe from './screens/OnMe/';
import OnMeInfo from './screens/OnMe/OnMeInfo';
import Transactions from './screens/Transactions';
import AcceptGive from './screens/AcceptGive';
import GiveList from './screens/AcceptGive/Give/GiveList/';
import GiveScaner from './screens/AcceptGive/Give/GiveScaner';
import GiveListCheck from './screens/AcceptGive/Give/GiveListCheck';
import GiveFinish from './screens/AcceptGive/Give/GiveFinish';
import Transfers from './screens/Transfers';
import TransferInfo from './screens/Transfers/TransferInfo';

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
    <Provider store={store}>
      <NavigationContainer>
        <NativeRouter>
          <PaperProvider theme={theme}>
            <StatusBar barStyle="light-content" backgroundColor="#3a6fdb" />
            <Drawer.Navigator initialRouteName="Auth">
              <Drawer.Screen name="Auth" component={Auth} />
              <Drawer.Screen name="Home" component={Main} />
              <Drawer.Screen name="Ident" component={Ident} />
              <Drawer.Screen name="IdentInfo" component={IdentInfo} />
              <Drawer.Screen name="Service" component={Service} />
              <Drawer.Screen name="ServiceInfo" component={ServiceInfo} />
              <Drawer.Screen name="ServiceFinish" component={ServiceFinish} />
              <Drawer.Screen name="WriteOff" component={WriteOff} />
              <Drawer.Screen name="WriteOffInfo" component={WriteOffInfo} />
              <Drawer.Screen name="WriteOffFinish" component={WriteOffFinish} />
              <Drawer.Screen name="Marking" component={Marking} />
              <Drawer.Screen name="MarkingList" component={MarkingList} />
              <Drawer.Screen name="MarkingScaner" component={MarkingScaner} />
              <Drawer.Screen name="MarkingFinish" component={MarkingFinish} />
              <Drawer.Screen name="OnMe" component={OnMe} />
              <Drawer.Screen name="OnMeInfo" component={OnMeInfo} />
              <Drawer.Screen name="Transactions" component={Transactions} />
              <Drawer.Screen name="AcceptGive" component={AcceptGive} />
              <Drawer.Screen name="GiveList" component={GiveList} />
              <Drawer.Screen name="GiveScaner" component={GiveScaner} />
              <Drawer.Screen name="GiveListCheck" component={GiveListCheck} />
              <Drawer.Screen name="GiveFinish" component={GiveFinish} />
              <Drawer.Screen name="Transfers" component={Transfers} />
              <Drawer.Screen name="TransferInfo" component={TransferInfo} />
            </Drawer.Navigator>
          </PaperProvider>
        </NativeRouter>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
