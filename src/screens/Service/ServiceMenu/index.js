import React from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView} from 'react-native';
// components
import Appbar from '../../../components/Appbar';
import DarkButton from '../../../components/Buttons/DarkButton';
import TransparentButton from '../../../components/Buttons/TransparentButton';

const ServiceMenu = props => {
  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        newScan={true}
        goTo={'Home'}
        title={'Отправка/возврат из сервиса'}
      />
      <SafeAreaView />
      <View style={styles.body}>
        <View style={styles.buttons}>
          <View style={styles.buttonBlock}>
            <DarkButton
              text={'Отправить в сервис'}
              onPress={() => props.navigation.navigate('Service')}
            />
          </View>
          <View style={styles.buttonBlock}>
            <TransparentButton
              text={'Вернуть из сервиса'}
              onPress={() => props.navigation.navigate('BackScanner')}
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
  buttonStyle: {
    width: Dimensions.get('window').width / 1.5,
    height: Dimensions.get('window').height / 15,
  },
  buttons: {
    top: Dimensions.get('window').height / 3,
  },
  BottomButton: {
    position: 'absolute',
    bottom: 140,
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default ServiceMenu;
