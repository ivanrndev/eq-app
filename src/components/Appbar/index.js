import React, {useState} from 'react';
import {Appbar, IconButton, Portal, Snackbar} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {StyleSheet, View} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import T from '../../i18n';

import {
  allowNewScan,
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
  saveInventoryItem,
} from '../../actions/actions.js';
import Search from '../Search';
import NFC from '../../screens/NFC';

const AppbarCustom = props => {
  const dispatch = useDispatch();
  const icon = props.arrow ? 'arrow-left' : 'menu';
  const [isConnection, setIsConnection] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNFCOpen, setIsNFCOpen] = useState(false);

  NetInfo.fetch().then(state => {
    if (state.isConnected) {
      setIsConnection(false);
    } else {
      setIsConnection(true);
    }
  });

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
              dispatch(saveInventoryItem([]));
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
            if (props.search) {
              setIsSearchOpen(false);
            }
            if (props.switch) {
              setIsNFCOpen(false);
            }
            if (isNFCOpen) {
              dispatch(allowNewScan(true));
              dispatch(clearMarking());
            }
          }}
        />
        <Appbar.Content
          title={isNFCOpen ? 'NFC' : props.title}
          titleStyle={styles.content}
        />
        {props.switch && (
          <IconButton
            icon={isNFCOpen ? 'camera' : 'cast'}
            size={30}
            color="#22215B"
            onPress={() => {
              setIsNFCOpen(!isNFCOpen);
              setIsSearchOpen(false);
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
        {props.handleSelect && (
          <IconButton
            icon={
              props.rejectIds.length === 0 ? 'select-inverse' : 'select-all'
            }
            size={25}
            color="#22215B"
            onPress={props.handleSelect}
            style={styles.selectBtn}
          />
        )}
      </Appbar.Header>
      {isSearchOpen && (
        <Search
          list={props.list}
          listAction={props.listAction}
          pageToChosenItem={props.pageToChosenItem}
          setIsSearchOpen={setIsSearchOpen}
          isSearchForGiveItem={props.isSearchForGiveItem}
          onSelectAction={props.onSelectAction}
        />
      )}
      {isNFCOpen && <NFC />}
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
    textAlign: 'center',
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
  selectBtn: {
    marginRight: 15,
  },
});

export default AppbarCustom;
