import React from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView} from 'react-native';
import {Button, Title} from 'react-native-paper';
// components
import Appbar from '../../../components/Appbar';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {allowNewScan} from '../../../actions/actions.js';

export const ServiceFinish = props => {
  const dispatch = useDispatch();
  const services = useSelector(state => state.services);
  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        goTo={'Home'}
        title={'Отправка в сервис'}
      />
      <SafeAreaView />
      <View style={styles.body}>
        <View style={styles.info}>
          <View style={styles.info}>
            {!services.inServicesError && (
              <Title style={styles.title}>Инструмент отправлен в сервис</Title>
            )}
            {services.inServicesError && (
              <Title style={styles.title}>Инструмент уже в ремонте</Title>
            )}
          </View>
        </View>
        <Button
          style={styles.button}
          mode="contained"
          color="#3a6fdb"
          onPress={() => {
            props.navigation.navigate('Home');
            dispatch(allowNewScan(true));
          }}>
          Меню
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    display: 'flex',
  },
  info: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    color: 'black',
    textAlign: 'center',
    padding: 30,
  },
  text: {
    fontSize: 20,
    color: 'black',
    width: Dimensions.get('window').width / 1.3,
  },
  button: {
    display: 'flex',
    textAlign: 'center',
    top: Dimensions.get('window').height / 3,
    justifyContent: 'center',
    height: Dimensions.get('window').height / 15,
    alignSelf: 'center',
    marginTop: 10,
    width: Dimensions.get('window').width / 1.5,
  },
  snackbar: {},
});

export default ServiceFinish;
