import React from 'react';
import {SafeAreaView, Dimensions, StyleSheet, View} from 'react-native';
import {Button} from 'react-native-paper';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Appbar from '../../components/Appbar';

const Main = props => {
  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={false}
        goTo={'Home'}
        title={'Меню'}
      />
      <View style={styles.body}>
        <SafeAreaView />
        <Button
          style={styles.button}
          icon="help"
          mode="contained"
          color="#3a6fdb"
          onPress={() => props.navigation.navigate('Ident')}>
          Идентификация
        </Button>
        <Button
          style={styles.button}
          icon="qrcode"
          mode="contained"
          color="#3a6fdb"
          onPress={() => props.navigation.navigate('Marking')}>
          Маркировка
        </Button>
        <Button
          style={styles.button}
          icon="checkbook"
          mode="contained"
          color="gray"
          onPress={() => alert('Инвентаризация')}>
          Инвентаризация
        </Button>
        <Button
          style={styles.button}
          icon="briefcase"
          mode="contained"
          color="gray"
          onPress={() => alert('Принять / Выдать ТМЦ')}>
          Принять / Выдать ТМЦ
        </Button>
        <Button
          style={styles.button}
          icon="hammer"
          mode="contained"
          color="#3a6fdb"
          onPress={() => props.navigation.navigate('Service')}>
          Отправка в сервис
        </Button>
        <Button
          style={styles.button}
          icon="cup"
          mode="contained"
          color="#3a6fdb"
          onPress={() => props.navigation.navigate('WriteOff')}>
          Списать
        </Button>
        <Button
          style={styles.button}
          icon="account"
          mode="contained"
          color="gray"
          onPress={() => alert('Что на мне?')}>
          Что на мне?
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    alignSelf: 'center',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    marginTop: Dimensions.get('window').height / 23,
    borderRadius: 5,
    height: Dimensions.get('window').height / 13,
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
});

export default Main;
