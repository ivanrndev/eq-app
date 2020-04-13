import React, {useState} from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView, Text} from 'react-native';
import {Button, Title} from 'react-native-paper';
// components
import Appbar from '../../../components/Appbar';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {allowNewScan, getTransactions} from '../../../actions/actions.js';
import {getStatus, getProperErrorMessage} from '../../../utils/helpers.js';
import AsyncStorage from '@react-native-community/async-storage';

export const IdentInfo = props => {
  const dispatch = useDispatch();
  const store = useSelector(state => state.scan);
  const error = getProperErrorMessage(store.scanInfoError, store.currentScan);
  const show = store.isInfoOpen;
  const metaData = store.scanInfo.metadata;
  const [role, setRole] = useState();
  const againScan = () => {
    props.navigation.navigate('Ident');
    dispatch(allowNewScan(true));
  };

  const getRole = async () => {
    try {
      const value = await AsyncStorage.getItem('role');
      if (value !== null) {
        setRole(value);
      }
    } catch (e) {
      console.log('no role');
    }
  };
  getRole();

  return (
    <>
      <Appbar
        navigation={props.navigation}
        newScan={true}
        arrow={true}
        goTo={'Ident'}
        title={'Информация о ТМЦ'}
      />
      <SafeAreaView />
      <View style={styles.body}>
        {store.scanInfoError && (
          <View style={styles.info}>
            <Title style={styles.title}>{error}</Title>
          </View>
        )}
        {!store.scanInfoError && (
          <View style={styles.info}>
            {show && (
              <View style={styles.info}>
                {store.scanInfo && (
                  <Text style={styles.text}>
                    Статус: {getStatus(store.scanInfo, role)}
                  </Text>
                )}
                {metaData && (
                  <Text style={styles.text}>Бренд: {metaData.brand}</Text>
                )}
                {metaData && (
                  <Text style={styles.text}>Модель: {metaData.model}</Text>
                )}
                {metaData && (
                  <Text style={styles.text}>Мощность: {metaData.capacity}</Text>
                )}
                {metaData && (
                  <Text style={styles.text}>Серия: {metaData.serial}</Text>
                )}
                {metaData && (
                  <Text style={styles.text}>Тип: {metaData.type}</Text>
                )}
                {store.scanInfo.customFields &&
                  store.scanInfo.customFields.map((item, index) => {
                    return (
                      <Text key={index} style={styles.text}>
                        {item.label}: {item.value}
                      </Text>
                    );
                  })}
                {store.scanInfo.person && (
                  <Text style={styles.text}>
                    Закреплен на: {store.scanInfo.person.firstName}{' '}
                    {store.scanInfo.person.lastName}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
        <Button
          style={styles.button}
          contentStyle={styles.buttonStyle}
          mode="contained"
          color="#3a6fdb"
          onPress={againScan}>
          Еще раз
        </Button>
        {!store.scanInfoError && (
          <Button
            style={styles.button}
            contentStyle={styles.buttonStyle}
            mode="contained"
            color="#3a6fdb"
            onPress={() => {
              dispatch(
                getTransactions(store.scanInfo._id, props.navigation, 0),
              );
            }}>
            История транзакций
          </Button>
        )}
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
    paddingTop: 20,
    paddingBottom: Dimensions.get('window').height / 15,
  },
  title: {
    color: 'black',
    textAlign: 'center',
    padding: 30,
  },
  text: {
    fontSize: 20,
    paddingBottom: 5,
    color: 'black',
    width: Dimensions.get('window').width / 1.3,
  },
  button: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonStyle: {
    width: Dimensions.get('window').width / 1.5,
    height: Dimensions.get('window').height / 15,
  },
});

export default IdentInfo;
