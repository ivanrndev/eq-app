import React, {useState} from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView, Text} from 'react-native';
import {Button, Title} from 'react-native-paper';
// components
import Appbar from '../../../components/Appbar';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {allowNewScan, sendToWriteOff} from '../../../actions/actions.js';
import {getStatus, getProperErrorMessage} from '../../../utils/helpers.js';
import AsyncStorage from '@react-native-community/async-storage';

export const WriteOffInfo = props => {
  const dispatch = useDispatch();
  const store = useSelector(state => state.scan);
  const error = getProperErrorMessage(store.scanInfoError, store.currentScan);
  const show = store.isInfoOpen;
  const metaData = store.scanInfo.metadata;
  const [role, setRole] = useState();

  const againScan = () => {
    props.navigation.navigate('WriteOff');
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

  // v2 - one screen Error WriteOff
  // if (store.scanInfo.is_ban === 'IsBan') {
  //   dispatch(putWriteOffError('IsBan'));
  //   props.navigation.navigate('WriteOffFinish');
  //   return null;
  // }

  return (
    <>
      <Appbar
        navigation={props.navigation}
        newScan={true}
        arrow={true}
        goTo={'WriteOff'}
        title={'Списание'}
      />
      <SafeAreaView />
      <View style={styles.body}>
        <View style={styles.info}>
          {store.scanInfoError && (
            <View style={styles.info}>
              <Title style={styles.title}>{error}</Title>
            </View>
          )}
          {!store.scanInfoError && (
            <View style={styles.info}>
              <Title style={styles.title}>Списать?</Title>
              {show && (
                <View style={styles.info}>
                  {store.scanInfo && (
                    <Text style={styles.text}>
                      Статус: {getStatus(store.scanInfo, role)}
                    </Text>
                  )}
                  {metaData.brand && (
                    <Text style={styles.text}>Бренд: {metaData.brand}</Text>
                  )}
                  {metaData.model && (
                    <Text style={styles.text}>Модель: {metaData.model}</Text>
                  )}
                  {metaData.capacity && (
                    <Text style={styles.text}>
                      Мощность: {metaData.capacity}
                    </Text>
                  )}
                  {metaData.serial && (
                    <Text style={styles.text}>Серия: {metaData.serial}</Text>
                  )}
                  {metaData.type && (
                    <Text style={styles.text}>Тип: {metaData.type}</Text>
                  )}
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
        </View>
        {!store.scanInfoError && (
          <Button
            style={styles.button}
            contentStyle={styles.buttonStyle}
            mode="contained"
            color="#3a6fdb"
            onPress={() => {
              dispatch(sendToWriteOff(store.scanInfo._id, props.navigation));
            }}>
            Списать
          </Button>
        )}
        <Button
          style={styles.button}
          contentStyle={styles.buttonStyle}
          mode="contained"
          color="#3a6fdb"
          onPress={againScan}>
          Отмена
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
    paddingBottom: Dimensions.get('window').height / 40,
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
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonStyle: {
    width: Dimensions.get('window').width / 1.5,
    height: Dimensions.get('window').height / 15,
  },
});

export default WriteOffInfo;
