/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
// navigation and router
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NativeRouter} from 'react-router-native';

// components
import Main from './screens/Main';
import Auth from './screens/Auth';
import Ident from './screens/Ident';
import IdentInfo from './screens/Ident/IdentInfo';
import ServiceMenu from './screens/Service/ServiceMenu';
import BackScanner from './screens/Service/Back/BackScanner';
import BackInfo from './screens/Service/Back/BackInfo';
import BackFinish from './screens/Service/Back/BackFinish';
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
import OnMeInfo from './screens/OnMe/OnMeInfo';
import Transactions from './screens/Transactions';
import AcceptGive from './screens/AcceptGive';
import GiveList from './screens/AcceptGive/Give/GiveList/';
import GiveScaner from './screens/AcceptGive/Give/GiveScaner';
import GiveListCheck from './screens/AcceptGive/Give/GiveListCheck';
import GiveFinish from './screens/AcceptGive/Give/GiveFinish';
import Transfers from './screens/Transfers';
import TransferInfo from './screens/Transfers/TransferInfo';
import Accept from './screens/AcceptGive/Accept';
import AcceptList from './screens/AcceptGive/Accept/AcceptList';
import AcceptScaner from './screens/AcceptGive/Accept/AcceptScaner';
import AcceptFinish from './screens/AcceptGive/Accept/AcceptFinish';
import Inventory from './screens/Inventory';
import InventoryScaner from './screens/Inventory/InventoryScaner';
import InventoryDone from './screens/Inventory/InventoryDone';
import Comments from './screens/Сomments/';
import CustomDrawer from './components/Drawer';
import Settings from './screens/Settings';
import TransfersEdit from './screens/Transfers/TransferEdit';
import TransferScaner from './screens/Transfers/TransferScan';
import NFC from './screens/NFC';
import MountList from './screens/Ident/MountList';
import MountNoMarking from './screens/Ident/MountNoMarking';
import GiveSetQuantity from './screens/AcceptGive/Give/GiveListCheck/GiveSetQuantity';
import Search from './components/Search';
import InventoryChooseMode from './screens/Inventory/InventoryChooseMode';
import SetInventoryQty from './screens/Inventory/SetInventoryQty';

import MountItemSetQty from './screens/Ident/MountList/MountItemSetQty';
import TransferSetQuantity from './screens/Transfers/TransferSetQty';
import ChooseCommentPhotoMode from './components/Gallery/ChooseCommentPhotoMode';
import ChooseItemPhotoMode from './components/Gallery/ChooseItemPhotoMode';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

import CreateItem from './screens/CreateItem';
import CreateInventoryItem from './screens/Inventory/InventoryChooseMode/CreateInventoryItem';
import BaseInfo from './screens/CreateItem/BaseInfo';
import AccountingAndValue from './screens/CreateItem/AccountingAndValue';
import AddPhoto from './screens/CreateItem/AddPhoto';
import ItemLocation from './screens/CreateItem/ItemLocation';
import Responsible from './screens/CreateItem/Responsible';
import AdditionalInfo from './screens/CreateItem/AdditionalInfo';
import MoveStartPage from "./screens/AcceptGive/MoveToObject/MoveStartPage";
import MoveScaner from "./screens/AcceptGive/MoveToObject/MoveScaner";
import MoveLocation from "./screens/AcceptGive/MoveToObject/MoveLocation";
import MoveSuccess from "./screens/AcceptGive/MoveToObject/MoveSuccess/MoveSuccess";
import CreateFinish from './screens/CreateItem/CreateFinish/CreateFinish';
import {OnMeNavigation} from "./screens/OnMe/OnMeNavigation";
import OnMe from "./screens/OnMe";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2D2C71',
    accent: '#137CDF',
  },
  roundnes: 10,
};

const Drawer = createDrawerNavigator();
// XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
//     GLOBAL.originalXMLHttpRequest :
//     GLOBAL.XMLHttpRequest;

const App = () => {
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      getFcmToken();
    }
  };

  useEffect(() => {
    requestUserPermission();
  }, []);

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      AsyncStorage.setItem('fcmToken', fcmToken);
    }
  };
  const getPushData = async message => {
    PushNotification.localNotification({
      message: message.notification.body,
    });
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(getPushData);
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <NativeRouter>
        <PaperProvider theme={theme}>
          <StatusBar barStyle="light-content" />
          <Drawer.Navigator
            drawerContent={props => <CustomDrawer {...props} />}
            initialRouteName="Auth">
            <Drawer.Screen name="Auth" component={Auth} />
            <Drawer.Screen name="Home" component={Main} />
            <Drawer.Screen name="Ident" component={Ident} />
            <Drawer.Screen name="IdentInfo" component={IdentInfo} />
            <Drawer.Screen name="ServiceMenu" component={ServiceMenu} />
            <Drawer.Screen name="BackScanner" component={BackScanner} />
            <Drawer.Screen name="BackInfo" component={BackInfo} />
            <Drawer.Screen name="BackFinish" component={BackFinish} />
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
            <Drawer.Screen name="CreateItem" component={CreateItem} />
            <Drawer.Screen name="CreateItemBaseInfo" component={BaseInfo} />
            <Drawer.Screen
              name="CreateItemQty"
              component={AccountingAndValue}
            />
            <Drawer.Screen name="CreateItemsPhotos" component={AddPhoto} />
            <Drawer.Screen name="CreateItemLocation" component={ItemLocation} />
            <Drawer.Screen name="CreateMoveLocation" component={MoveLocation} />
            <Drawer.Screen
              name="CreateItemResponsible"
              component={Responsible}
            />
            <Drawer.Screen
              name="CreateItemAdditionalInfo"
              component={AdditionalInfo}
            />
            <Drawer.Screen name="CreateFinish" component={CreateFinish} />
            <Drawer.Screen name="MoveSuccess" component={MoveSuccess} />
            <Drawer.Screen name="Transactions" component={Transactions} />
            <Drawer.Screen name="AcceptGive" component={AcceptGive} />
            <Drawer.Screen name="GiveList" component={GiveList} />
            <Drawer.Screen name="GiveScaner" component={GiveScaner} />
            <Drawer.Screen name="GiveListCheck" component={GiveListCheck} />
            <Drawer.Screen name="GiveSetQuantity" component={GiveSetQuantity} />
            <Drawer.Screen name="GiveFinish" component={GiveFinish} />
            <Drawer.Screen name="Transfers" component={Transfers} />
            <Drawer.Screen name="TransferInfo" component={TransferInfo} />
            <Drawer.Screen name="Accept" component={Accept} />
            <Drawer.Screen name="AcceptList" component={AcceptList} />
            <Drawer.Screen name="AcceptScaner" component={AcceptScaner} />
            <Drawer.Screen name="AcceptFinish" component={AcceptFinish} />
            <Drawer.Screen name="Inventory" component={Inventory} />
            <Drawer.Screen name="MoveScaner" component={MoveScaner} />
            <Drawer.Screen
              name="InventoryChooseMode"
              component={InventoryChooseMode}
            />
            <Drawer.Screen
                name="MoveStartPage"
                component={MoveStartPage}
            />
            <Drawer.Screen name="InventoryScaner" component={InventoryScaner} />
            <Drawer.Screen name="InventoryDone" component={InventoryDone} />
            <Drawer.Screen name="SetInventoryQty" component={SetInventoryQty} />
            <Drawer.Screen
              name="CreateInventoryItem"
              component={CreateInventoryItem}
            />
            <Drawer.Screen name="Comments" component={Comments} />
            <Drawer.Screen name="Settings" component={Settings} />
            <Drawer.Screen name="TransfersEdit" component={TransfersEdit} />
            <Drawer.Screen name="TransferScaner" component={TransferScaner} />
            <Drawer.Screen
              name="TransferSetQty"
              component={TransferSetQuantity}
            />
            <Drawer.Screen name="NFC" component={NFC} />
            <Drawer.Screen name="MountList" component={MountList} />
            <Drawer.Screen name="MountItemQty" component={MountItemSetQty} />
            <Drawer.Screen name="Search" component={Search} />
            <Drawer.Screen
              name="ChooseCommentPhotoMode"
              component={ChooseCommentPhotoMode}
            />
            <Drawer.Screen
              name="ChooseItemPhotoMode"
              component={ChooseItemPhotoMode}
            />
            <Drawer.Screen name="MountNoMarking" component={MountNoMarking} />
          </Drawer.Navigator>
        </PaperProvider>
      </NativeRouter>
    </NavigationContainer>
  );
};

export default App;
