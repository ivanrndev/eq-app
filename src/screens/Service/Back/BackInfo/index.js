import React, {useState} from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView, Text} from 'react-native';
import {Title, Portal, ActivityIndicator} from 'react-native-paper';
// components
import Appbar from '../../../../components/Appbar';
import DarkButton from '../../../../components/Buttons/DarkButton';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  allowNewScan,
  backFromServices,
  loader,
} from '../../../../actions/actions.js';
import {getStatus, getProperErrorMessage} from '../../../../utils/helpers.js';
import AsyncStorage from '@react-native-community/async-storage';

export const BackInfo = props => {
  const dispatch = useDispatch();
  const store = useSelector(state => state.scan);
  const settings = useSelector(state => state.settings);
  const error = getProperErrorMessage(store.scanInfoError, store.currentScan);
  const show = store.isInfoOpen;
  const metaData = store.scanInfo.metadata;
  const [role, setRole] = useState();
  const arrayIds = [store.scanInfo._id];

  let nameOfProduct = '';
  if (metaData) {
    nameOfProduct = metaData.title
      ? metaData.title
      : `${metaData.type} ${metaData.brand} ${metaData.model} ${
          metaData.serial
        }`;
  }

  const backService = () => {
    dispatch(loader(true));
    dispatch(backFromServices(arrayIds, props.navigation));
  };

  const againScan = () => {
    props.navigation.navigate('ServiceMenu');
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
        goTo={'BackScanner'}
        title={'Вернуть из сервиса'}
      />
      <SafeAreaView />
      <Portal>
        {settings.loader && (
          <View style={styles.loader}>
            <ActivityIndicator
              style={styles.load}
              size={80}
              animating={true}
              color={'#EDF6FF'}
            />
          </View>
        )}
      </Portal>
      <View style={styles.body}>
        <View style={styles.container}>
          <View style={styles.info}>
            {store.scanInfoError && (
              <View style={styles.info}>
                <Title style={styles.titleError}>{error}</Title>
              </View>
            )}
            {!store.scanInfoError && (
              <View style={styles.info}>
                <Title style={styles.title}>Вернуть из сервиса?</Title>
                {show && (
                  <View style={styles.info}>
                    {store.scanInfo && (
                      <Text style={styles.text}>
                        Статус: {getStatus(store.scanInfo, role)}
                      </Text>
                    )}
                    {metaData && (
                      <Text style={styles.text}>Название: {nameOfProduct}</Text>
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
          <View style={styles.buttons}>
            {!store.scanInfoError && (
              <>
                <View style={styles.buttonBlock}>
                  <DarkButton text={'Вернуть'} onPress={backService} />
                </View>
              </>
            )}
            <View style={styles.buttonBlock}>
              <DarkButton text={'Отмена'} comments={true} onPress={againScan} />
            </View>
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
  container: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 10,
    height: Dimensions.get('window').height / 1.3,
    paddingBottom: 10,
    paddingTop: 20,
    width: Dimensions.get('window').width / 1.1,
    backgroundColor: '#EDF6FF',
  },
  buttonBlock: {
    width: Dimensions.get('window').height / 3.3,
    textAlign: 'center',
    display: 'flex',
    alignSelf: 'center',
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: Dimensions.get('window').height / 40,
  },
  title: {
    color: '#22215B',
    textAlign: 'center',
    padding: 30,
    fontSize: 21,
  },
  titleError: {
    color: '#E40B67',
    textAlign: 'center',
    padding: 30,
    fontSize: 21,
  },
  text: {
    fontSize: 16,
    paddingBottom: 5,
    color: '#7A7A9D',
    width: Dimensions.get('window').width / 1.3,
  },
  buttons: {
    position: 'absolute',
    bottom: 20,
    width: Dimensions.get('window').width / 1.5,
  },
  buttonStyle: {
    width: Dimensions.get('window').width / 1.5,
    height: Dimensions.get('window').height / 15,
  },
  textInput: {
    display: 'flex',
    alignSelf: 'center',
    height: 50,
    width: Dimensions.get('window').width / 1.3,
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

export default BackInfo;
