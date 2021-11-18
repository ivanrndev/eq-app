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
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import DarkButton from '../../components/Buttons/DarkButton';
import T from '../../i18n';

// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {currentScan, loader} from '../../actions/actions.js';

const NFC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settings);
  const [log, setLog] = useState(T.t('hold_nfc'));

  useFocusEffect(
    useCallback(() => {
      NfcManager.start();
      readData();
      return () => {
        cleanUp();
        setLog(T.t('hold_nfc'));
      };
    }, [readData, settings.nfcNext, settings.NFCforMounting]),
  );

  const cleanUp = () => {
    NfcManager.cancelTechnologyRequest().catch(() => 0);
  };

  const readData = async () => {
    try {
      let tech = Platform.OS === 'ios' ? NfcTech.MifareIOS : NfcTech.NfcA;
      let resp = await NfcManager.requestTechnology(tech, {
        alertMessage: T.t('ready_nfc'),
      });

      let cmd =
        Platform.OS === 'ios'
          ? NfcManager.sendMifareCommandIOS
          : NfcManager.transceive;

      resp = await cmd([0x3a, 4, 4]);
      let payloadLength = parseInt(resp.toString().split(",")[1]);
      let payloadPages = Math.ceil(payloadLength / 4);
      let startPage = 5;
      let endPage = startPage + payloadPages - 1;
      resp = await cmd([0x3A, startPage, endPage]);
      console.log({resp});
      bytes = resp.toString().split(',');

      function removeElement(arrayName, arrayElement) {
        for (var i = 0; i < arrayName.length; i++) {
          if (arrayName[i] == arrayElement) {
            arrayName.splice(i, 1);
          }
        }
      }
      removeElement(bytes, '0');

      let text = '';
      const number = bytes.length <= 13 ? 5 : 10;
      console.log(bytes);
      for (let i = 0; i < bytes.length; i++) {

        // if (i < number) {
        //   continue;
        // }
        // if (parseInt(bytes[i]) === 254) {
        //   break;
        // }
        console.log(String.fromCharCode(parseInt(bytes[i])));
        text = text + String.fromCharCode(parseInt(bytes[i]));
      }

      let checkFormat = /^[a-zA-Z0-9]+$/;

      let codeFormat = checkFormat.exec(text);


      if (codeFormat) {
        setLog(text);
        dispatch(loader(true));
        dispatch(
          currentScan(
            text,
            navigation,
            settings.NFCforMounting ? settings.nextPageMount : settings.nfcNext,
            settings.isMultiple,
            settings.NFCforMounting,
          ),
        );
      } else {
        setLog(T.t('wrong_format_info'));
      }

      cleanUp();
    } catch (ex) {
      setLog(T.t('again'));
      cleanUp();
    }
  };

  return (
    <View style={styles.wrap}>
      <SafeAreaView style={styles.container}>
        <View style={styles.log}>
          <Text style={styles.info}>{log}</Text>
        </View>
        <View style={styles.button}>
          <DarkButton text={T.t('again_short')} onPress={readData} />
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
