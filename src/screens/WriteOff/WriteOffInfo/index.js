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
              <Text style={styles.text}>
                Бренд: {show ? metaData.brand : null}
              </Text>
              <Text style={styles.text}>
                Модель: {show ? metaData.model : null}
              </Text>
              <Text style={styles.text}>
                Мощность: {show ? metaData.capacity : null}
              </Text>
              <Text style={styles.text}>
                Серия: {show ? metaData.serial : null}
              </Text>
              <Text style={styles.text}>
                Модель: {show ? metaData.model : null}
              </Text>
              <Text style={styles.text}>
                Тип: {show ? metaData.type : null}
              </Text>
              <Text style={styles.text}>
                Закреплен на:{' '}
                {show ? store.scanInfo.responsible.firstName : null}
              </Text>
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
    top: Dimensions.get('window').height / 4,
    justifyContent: 'center',
    height: Dimensions.get('window').height / 15,
    alignSelf: 'center',
    marginTop: 10,
    width: Dimensions.get('window').width / 1.5,
  },
  snackbar: {},
});

export default WriteOffInfo;
