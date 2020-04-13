import React from 'react';
import {SafeAreaView, Dimensions, StyleSheet, View} from 'react-native';
import {Button} from 'react-native-paper';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Appbar from '../../components/Appbar';
import {useDispatch} from 'react-redux';
import {getItemsOnMe} from '../../actions/actions.js';

const Main = props => {
  const dispatch = useDispatch();
  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={false}
        newScan={false}
        goTo={'Home'}
        title={'Меню'}
      />
      <View style={styles.body}>
        <SafeAreaView />
        <Button
          style={styles.button}
          contentStyle={styles.buttonStyle}
          icon="help"
          mode="contained"
          color="#3a6fdb"
          onPress={() => props.navigation.navigate('Ident')}>
          Идентификация
        </Button>
        <Button
          style={styles.button}
          contentStyle={styles.buttonStyle}
          icon="qrcode"
          mode="contained"
          color="#3a6fdb"
          onPress={() => props.navigation.navigate('Marking')}>
          Маркировка
        </Button>
        <Button
          style={styles.button}
          contentStyle={styles.buttonStyle}
          icon="checkbook"
          mode="contained"
          color="gray"
          onPress={() => alert('Инвентаризация')}>
          Инвентаризация
        </Button>
        <Button
          style={styles.button}
          contentStyle={styles.buttonStyle}
          icon="briefcase"
          mode="contained"
          color="#3a6fdb"
          onPress={() => props.navigation.navigate('AcceptGive')}>
          Принять / Выдать ТМЦ
        </Button>
        <Button
          style={styles.button}
          contentStyle={styles.buttonStyle}
          icon="hammer"
          mode="contained"
          color="#3a6fdb"
          onPress={() => props.navigation.navigate('Service')}>
          Отправка в сервис
        </Button>
        <Button
          style={styles.button}
          contentStyle={styles.buttonStyle}
          icon="cup"
          mode="contained"
          color="#3a6fdb"
          onPress={() => props.navigation.navigate('WriteOff')}>
          Списать
        </Button>
        <Button
          style={styles.button}
          contentStyle={styles.buttonStyle}
          icon="account"
          mode="contained"
          color="#3a6fdb"
          onPress={() => dispatch(getItemsOnMe(props.navigation))}>
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
    marginTop: Dimensions.get('window').height / 23,
    borderRadius: 5,
  },
  buttonStyle: {
    width: Dimensions.get('window').width / 1.1,
    height: Dimensions.get('window').height / 13,
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
});

export default Main;
