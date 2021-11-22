/* eslint-disable radix */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React, {useCallback, useState} from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import NfcManager, {NfcTech, NfcEvents} from 'react-native-nfc-manager';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import DarkButton from '../../components/Buttons/DarkButton';
import T from '../../i18n';

// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {currentScan, loader} from '../../actions/actions.js';

const NFC = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settings);

  const [log, setLog] = useState(T.t('hold_nfc'));

  useFocusEffect(
    useCallback(() => {
      NfcManager.start();
      readNdef();
      return () => {
        cleanUp();
        setLog(T.t('hold_nfc'));
      };
    }, [readNdef, settings.nfcNext, settings.NFCforMounting]),
  );

  const cleanUp = () => {
    NfcManager.cancelTechnologyRequest().catch(() => 0);
  };

  const readNdef = async () => {
    const cleanUp = () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      NfcManager.setEventListener(NfcEvents.SessionClosed, null);
    };
    try {
      return new Promise((resolve) => {
        let tagFound = null;

        NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
          tagFound = tag;
          let text = '';
          resolve(tagFound);
          let bites = tagFound.ndefMessage[0].payload;
          for (let i = 0; i < bites.length; i++) {
            if (i < 3) {
              continue;
            }
            text += String.fromCharCode(bites[i]);
            // console.log({text});
          }
          console.log({text});
          setLog(text);
          dispatch(loader(true));
          dispatch(
              currentScan(
                  text,
                  navigation,
                  props.move?'MoveStartPage':(settings.NFCforMounting ? settings.nextPageMount : settings.nfcNext),
                  settings.isMultiple,
                  settings.NFCforMounting));
          NfcManager.setAlertMessageIOS('NDEF tag found');
          NfcManager.unregisterTagEvent().catch(() => 0);
        });

        NfcManager.setEventListener(NfcEvents.SessionClosed, () => {
          cleanUp();
          if (!tagFound) {
            resolve();
          }
        });

        NfcManager.registerTagEvent();
      });

    }catch(ex){
      setLog(T.t('again'));
      cleanUp();
    }

  }

  return (
    <View style={styles.wrap}>
      <SafeAreaView style={styles.container}>
        <View style={styles.log}>
          <Text style={styles.info}>{log}</Text>
        </View>
        <View style={styles.button}>
          <DarkButton text={T.t('again_short')} onPress={readNdef} />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    height: Dimensions.get('window').height,
    backgroundColor: '#D3E3F2',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#D3E3F2',
  },
  log: {
    marginTop: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginLeft: 30,
    marginRight: 30,
  },
  info: {
    fontSize: 18,
  },
});

export default NFC;
