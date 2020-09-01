import React, {useState} from 'react';
import {Appbar, Snackbar, Portal} from 'react-native-paper';
import {withRouter} from 'react-router-native';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, View} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import T from '../../i18n';

import {
  allowNewScan,
  clearTransfer,
  clearTransaction,
  clearBidList,
  alreadyScannedBids,
  alreadyScanned,
  clearGiveList,
  clearUserList,
  clearMarking,
  clearComments,
  clearUserAcceptBid,
  switchStartPage,
} from '../../actions/actions.js';

const AppbarCustom = props => {
  const dispatch = useDispatch();
  const icon = props.arrow ? 'arrow-left' : 'menu';
  const [isConnection, setIsConnection] = useState(false);
  const iconSwitch = props.typeSwitchCamera ? 'camera' : 'cast';
  const settings = useSelector(state => state.settings);

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
            if (props.clearGiveList) {
              dispatch(clearGiveList());
            }
            if (props.alreadyScanned) {
              dispatch(alreadyScanned([]));
            }
            if (props.clearMarking) {
              dispatch(clearMarking());
            }
            if (props.menu) {
              props.navigation.openDrawer();
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
      </Appbar.Header>
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

export default withRouter(AppbarCustom);
