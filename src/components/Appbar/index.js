import React, {useState} from 'react';
import {Appbar, IconButton, Portal, Snackbar} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, View} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import T from '../../i18n';

import {
  allowNewScan,
  alreadyScanned,
  alreadyScannedBids,
  changeIsMultiple,
  changeLocationLoc,
  changeLocationMain,
  clearBidList,
  clearComments,
  clearGiveList,
  clearInventory,
  clearMarking,
  clearTransaction,
  clearTransfer,
  clearUserAcceptBid,
  clearUserList,
  NFCforMounting,
  switchStartPage,
} from '../../actions/actions.js';
import Search from '../Search';
import BackSearch from '../../screens/Service/Back/BackSearch';
import GiveSearch from '../../screens/AcceptGive/Give/GiveScaner/GiveSearch';

const AppbarCustom = props => {
  const dispatch = useDispatch();
  const icon = props.arrow ? 'arrow-left' : 'menu';
  const [isConnection, setIsConnection] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const iconSwitch = props.typeSwitchCamera ? 'camera' : 'cast';
  const settings = useSelector(state => state.settings);

  NetInfo.fetch().then(state => {
    if (state.isConnected) {
      setIsConnection(false);
    } else {
      setIsConnection(true);
    }
  });
  const SearchComponent = () => {
    if (props.backFromService) {
      return <BackSearch setIsSearchOpen={setIsSearchOpen} />;
    }
    if (props.giveSearch) {
      return <GiveSearch setIsSearchOpen={setIsSearchOpen} />;
    }
  };

  return (
    <>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Action
          icon={icon}
          onPress={() => {
            if (props.clearUserAcceptBid) {
              dispatch(clearUserAcceptBid());
            }
            if (props.clearComments) {
              dispatch(clearComments());
            }
            if (props.clearUserList) {
              dispatch(clearUserList());
            }
            if (props.goTo === 'back') {
              props.navigation.goBack();
            } else {
              props.navigation.navigate(props.goTo);
            }
            if (props.newScan) {
              dispatch(allowNewScan(true));
            }
            if (props.clearTransfer) {
              dispatch(clearTransfer());
            }
            if (props.clearTransaction) {
              dispatch(clearTransaction());
            }
            if (props.clearBidList) {
              dispatch(clearBidList());
            }
            if (props.alreadyScannedBids) {
              dispatch(alreadyScannedBids([]));
            }
            if (props.backPageMount) {
              dispatch(NFCforMounting(false));
            }
            if (props.clearGiveList) {
              dispatch(clearGiveList());
            }
            if (props.alreadyScanned) {
              dispatch(alreadyScanned([]));
            }
            if (props.clearMarking) {
              dispatch(clearMarking());
            }
            if (props.clearInventory) {
              dispatch(clearInventory());
            }
            if (props.menu) {
              props.navigation.openDrawer();
            }
            if (props.isMutiple) {
              dispatch(changeIsMultiple(false));
            }
            if (props.clearlocationMain) {
              dispatch(changeLocationMain(''));
            }
            if (props.clearlocationLoc) {
              dispatch(changeLocationLoc(''));
            }
          }}
        />
        <Appbar.Content title={props.title} titleStyle={styles.content} />
        {props.switch && (
          <Appbar.Action
            icon={iconSwitch}
            onPress={() => {
              if (props.typeSwitchNFC) {
                dispatch(switchStartPage(settings.nameOfType, 'NFC'));
                props.navigation.navigate('NFC');
              }
              if (props.typeSwitchCamera) {
                dispatch(
                  switchStartPage(settings.nameOfType, settings.swithCamera),
                );
                props.navigation.navigate(settings.swithCamera);
              }
            }}
          />
        )}

        {props.search && (
          <IconButton
            icon="magnify"
            size={35}
            color="#22215B"
            onPress={() => setIsSearchOpen(true)}
          />
        )}
      </Appbar.Header>
      {isSearchOpen && <SearchComponent />}
      <View style={styles.borderRadius} />
      <Portal>
        <Snackbar
          style={styles.snackbar}
          visible={isConnection}
          onDismiss={() => {}}
          action={() => {}}>
          {T.t('error_internet')}
        </Snackbar>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  borderRadius: {
    height: 15,
    zIndex: 99,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    backgroundColor: '#EDF6FF',
  },
  appbar: {
    backgroundColor: '#EDF6FF',
    zIndex: 99,
  },
  content: {
    color: '#22215B',
    fontWeight: 'bold',
  },
  snackbar: {
    zIndex: 100,
    backgroundColor: '#CB2B2B',
  },
  text: {
    display: 'flex',
    alignSelf: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: 15,
  },
});

export default AppbarCustom;
