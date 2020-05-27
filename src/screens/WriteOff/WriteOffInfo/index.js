import React, {useState} from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView, Text} from 'react-native';
import {Title, Portal, ActivityIndicator} from 'react-native-paper';
import T from '../../../i18n';
// components
import Appbar from '../../../components/Appbar';
import DarkButton from '../../../components/Buttons/DarkButton';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  loader,
  allowNewScan,
  sendToWriteOff,
} from '../../../actions/actions.js';
import {getStatus, getProperErrorMessage} from '../../../utils/helpers.js';
import AsyncStorage from '@react-native-community/async-storage';

export const WriteOffInfo = props => {
  const dispatch = useDispatch();
  const store = useSelector(state => state.scan);
  const settings = useSelector(state => state.settings);
  const error = getProperErrorMessage(store.scanInfoError, store.currentScan);
  const show = store.isInfoOpen;
  const metaData = store.scanInfo.metadata;
  const [role, setRole] = useState();

  let nameOfProduct = '';
  if (metaData) {
    nameOfProduct = metaData.title
      ? metaData.title
      : `${metaData.type} ${metaData.brand} ${metaData.model} ${
          metaData.serial
        }`;
  }

  const writteOff = () => {
    dispatch(loader(true));
    dispatch(sendToWriteOff(store.scanInfo._id, props.navigation));
  };

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

  return (
    <>
      <Appbar
        navigation={props.navigation}
        newScan={true}
        arrow={true}
        goTo={'WriteOff'}
        title={T.t('title_ban_question')}
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
                <Title style={styles.title}>{T.t('title_ban_question')}?</Title>
                {show && (
                  <View style={styles.info}>
                    {store.scanInfo && (
                      <Text style={styles.text}>
                        {T.t('transfer_status')}:{' '}
                        {getStatus(store.scanInfo, role)}
                      </Text>
                    )}
                    {metaData && (
                      <Text style={styles.text}>
                        {T.t('detail_title')}: {nameOfProduct}
                      </Text>
                    )}
                    {metaData.brand && (
                      <Text style={styles.text}>
                        {T.t('detail_brand')}: {metaData.brand}
                      </Text>
                    )}
                    {metaData.model && (
                      <Text style={styles.text}>
                        {T.t('detail_model')}: {metaData.model}
                      </Text>
                    )}
                    {metaData.capacity && (
                      <Text style={styles.text}>
                        {T.t('detail_capacity')}: {metaData.capacity}
                      </Text>
                    )}
                    {metaData.serial && (
                      <Text style={styles.text}>
                        {T.t('detail_serial')}: {metaData.serial}
                      </Text>
                    )}
                    {metaData.type && (
                      <Text style={styles.text}>
                        {T.t('detail_type')}: {metaData.type}
                      </Text>
                    )}
                    {store.scanInfo.person && (
                      <Text style={styles.text}>
                        {T.t('detail_person')}:{' '}
                        {store.scanInfo.person.firstName}{' '}
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
              <View style={styles.buttonBlock}>
                <DarkButton text={T.t('ban_btn')} onPress={writteOff} />
              </View>
            )}
            <View style={styles.buttonBlock}>
              <DarkButton text={T.t('cancel')} onPress={againScan} />
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
    display: 'flex',
    alignItems: 'center',
    width: Dimensions.get('window').width / 1.5,
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

export default WriteOffInfo;