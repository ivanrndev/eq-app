import React from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView} from 'react-native';
import T from '../../../i18n';
// components
import Appbar from '../../../components/Appbar';
import DarkButton from '../../../components/Buttons/DarkButton';
import TransparentButton from '../../../components/Buttons/TransparentButton';
import {nfc} from '../../../actions/actions.js';
import {useDispatch} from 'react-redux';

const SelectScanWriteOff = props => {
  const dispatch = useDispatch();
  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        newScan={true}
        clearMarking={true}
        goTo={'Home'}
        title={'Scanning'}
      />
      <SafeAreaView />
      <View style={styles.body}>
        <View style={styles.buttons}>
          <View style={styles.buttonBlock}>
            <DarkButton
              text={'QR Scan'}
              onPress={() => props.navigation.navigate('WriteOff')}
            />
            <TransparentButton
              text={'NFC'}
              onPress={() => {
                dispatch(nfc('SelectScanWriteOff', 'WriteOffInfo', false));
                props.navigation.navigate('NFC');
              }}
            />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    marginTop: -10,
    display: 'flex',
    paddingTop: 30,
    alignItems: 'center',
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height,
  },
  buttonBlock: {
    width: Dimensions.get('window').height / 3.3,
    textAlign: 'center',
  },
  title: {
    color: '#fff',
  },
  button: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  buttons: {
    top: Dimensions.get('window').height / 3,
  },
  loader: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: Dimensions.get('window').height / 9,
    zIndex: 99,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default SelectScanWriteOff;
