import React from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView, Text} from 'react-native';
import {Button, Title} from 'react-native-paper';
// components
import Appbar from '../../../components/Appbar';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {allowNewScan, sendToWriteOff} from '../../../actions/actions.js';

export const WriteOffInfo = props => {
  const dispatch = useDispatch();
  const store = useSelector(state => state.scan);
  const show = store.isInfoOpen;
  const metaData = store.scanInfo.metadata;

  const againScan = () => {
    props.navigation.navigate('WriteOff');
    dispatch(allowNewScan(true));
  };

  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        goTo={'WriteOff'}
        title={'Списание'}
      />
      <SafeAreaView />
      <View style={styles.body}>
        <View style={styles.info}>
          {store.scanInfoError && (
            <View style={styles.info}>
              <Title style={styles.title}>ТМЦ не найден</Title>
            </View>
          )}
          {!store.scanInfoError && (
            <View style={styles.info}>
              <Title style={styles.title}>Списать?</Title>
              {show && (
                <View style={styles.info}>
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
                  {store.scanInfo.responsible.firstName && (
                    <Text style={styles.text}>
                      Закреплен на: {store.scanInfo.responsible.firstName}
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
    height: Dimensions.get('window').height / 15,
    alignSelf: 'center',
    marginTop: 10,
    width: Dimensions.get('window').width / 1.5,
  },
});

export default WriteOffInfo;
