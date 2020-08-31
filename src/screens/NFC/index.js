/* eslint-disable radix */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React, {useState, useCallback} from 'react';
import {View, Text, Platform, SafeAreaView, StyleSheet} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import {useFocusEffect} from '@react-navigation/native';
import Appbar from '../../components/Appbar';
import DarkButton from '../../components/Buttons/DarkButton';

// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {currentScan, loader} from '../../actions/actions.js';

const NFC = props => {
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settings);
  const [log, setLog] = useState('Поднесите метку');

  useFocusEffect(
    useCallback(() => {
      NfcManager.start();
      readData();
      return () => {
        cleanUp();
        setLog('Поднесите метку');
      };
    }, [readData, settings.nfcNext]),
  );

  const cleanUp = () => {
    NfcManager.cancelTechnologyRequest().catch(() => 0);
  };

  const readData = async () => {
    try {
      let tech = Platform.OS === 'ios' ? NfcTech.MifareIOS : NfcTech.NfcA;
      let resp = await NfcManager.requestTechnology(tech, {
        alertMessage: 'Готовы к считыванию NFC местки',
      });

      let cmd =
        Platform.OS === 'ios'
          ? NfcManager.sendMifareCommandIOS
          : NfcManager.transceive;

      resp = await cmd([0x3a, 4, 4]);
      let payloadLength = parseInt(resp.toString().split(',')[1]);
      let payloadPages = Math.ceil(payloadLength / 4);
      let startPage = 5;
      let endPage = startPage + payloadPages - 1;

      resp = await cmd([0x3a, startPage, endPage]);
      bytes = resp.toString().split(',');
      let text = '';

      for (let i = 0; i < bytes.length; i++) {
        if (i < 5) {
          continue;
        }
        if (parseInt(bytes[i]) === 254) {
          break;
        }
        text = text + String.fromCharCode(parseInt(bytes[i]));
      }

      let checkFormat = /^[a-z]{1,2}[0-9]{4,5}$/g;
      let codeFormat = checkFormat.exec(text);

      if (codeFormat) {
        setLog(codeFormat[0]);
        dispatch(loader(true));
        dispatch(
          currentScan(
            codeFormat[0],
            props.navigation,
            settings.nfcNext,
            settings.isMultiple,
          ),
        );
      } else {
        setLog('Неверный формат');
      }

      cleanUp();
    } catch (ex) {
      // console.log(`ERROR: ${x.toString()}`);
      setLog('Попробуйте еще раз');
      cleanUp();
    }
  };

  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        newScan={true}
        clearMarking={true}
        goTo={settings.nfcBack}
        title={'NFC'}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.log}>
          <Text style={styles.info}>{log}</Text>
        </View>
        <View style={styles.button}>
          <DarkButton text={'Еще раз'} onPress={readData} />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#D3E3F2',
  },
  textInput: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    height: 50,
    textAlign: 'center',
    color: 'black',
  },
  buttonText: {
    color: '#ffffff',
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
