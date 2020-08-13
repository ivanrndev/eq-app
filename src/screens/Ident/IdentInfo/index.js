import React, {useState} from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView, Text} from 'react-native';
import {Title} from 'react-native-paper';
// components
import Appbar from '../../../components/Appbar';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  getTransactions,
  getComments,
  loader,
} from '../../../actions/actions.js';
import T from '../../../i18n';
import {getStatus, getProperErrorMessage} from '../../../utils/helpers.js';
import AsyncStorage from '@react-native-community/async-storage';
import DarkButton from '../../../components/Buttons/DarkButton';
import {fontSizer} from '../../../utils/helpers.js';

export const IdentInfo = props => {
  const dispatch = useDispatch();
  const store = useSelector(state => state.scan);
  const error = getProperErrorMessage(store.scanInfoError, store.currentScan);
  const show = store.isInfoOpen;
  const metaData = store.scanInfo.metadata;
  const width = Dimensions.get('window').width;

  let nameOfProduct = '';
  if (metaData) {
    nameOfProduct = metaData.title
      ? metaData.title
      : `${metaData.type} ${metaData.brand} ${metaData.model} ${
          metaData.serial
        }`;
  }

  const [role, setRole] = useState();
  let itemId = store.scanInfo._id;

  const getAllComments = () => {
    dispatch(loader(true));
    dispatch(getComments(props.navigation, itemId, 0, 'IdentInfo'));
  };

  const handleTransactions = () => {
    dispatch(loader(true));
    dispatch(getTransactions(store.scanInfo._id, props.navigation, 0));
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
        goTo={'SelectScan'}
        title={T.t('detail_info')}
      />
      <SafeAreaView />
      <View style={styles.body}>
        <View style={styles.container}>
          {store.scanInfoError && (
            <View style={styles.info}>
              <Title style={styles.titleError}>{error}</Title>
            </View>
          )}
          {!store.scanInfoError && (
            <View style={styles.info}>
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
                      {T.t('detail_person')}: {store.scanInfo.person.firstName}{' '}
                      {store.scanInfo.person.lastName}
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}
          {!store.scanInfoError && (
            <>
              <View style={styles.buttonsBlock}>
                <View style={styles.buttonBlock}>
                  <DarkButton
                    size={fontSizer(width)}
                    text={T.t('title_comments')}
                    onPress={getAllComments}
                  />
                  <DarkButton
                    size={fontSizer(width)}
                    text={T.t('title_history_of_transaction')}
                    onPress={handleTransactions}
                  />
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    display: 'flex',
    marginTop: -15,
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height,
  },
  buttonBlock: {
    width: Dimensions.get('window').height / 3,
    textAlign: 'center',
  },
  container: {
    backgroundColor: '#EDF6FF',
    borderRadius: 10,
    height: Dimensions.get('window').height / 1.3,
    margin: 20,
    marginTop: 35,
    paddingBottom: 20,
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: Dimensions.get('window').height / 30,
  },
  title: {
    color: '#7A7A9D',
    textAlign: 'center',
    padding: 30,
  },
  titleError: {
    color: '#E40B67',
    textAlign: 'center',
    padding: 30,
  },
  text: {
    fontSize: 16,
    paddingBottom: 5,
    color: '#7A7A9D',
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
  buttonsBlock: {
    position: 'absolute',
    display: 'flex',
    alignSelf: 'center',
    bottom: 20,
  },
});

export default IdentInfo;
