import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import T from '../../../i18n';
import {ActivityIndicator, Portal, TextInput, Title} from 'react-native-paper';
// components
import Appbar from '../../../components/Appbar';
import DarkButton from '../../../components/Buttons/DarkButton';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  allowNewScan,
  getTotalCountMyCompanyItems,
  loader,
  sendToServices,
} from '../../../actions/actions.js';
import {getProperErrorMessage, getStatus} from '../../../utils/helpers.js';
import AsyncStorage from '@react-native-community/async-storage';
import ItemSetQuantityArea from '../../../components/ItemSetQuantityArea';
import TariffLimitModal from '../../../components/TariffLimitModal';

export const ServiceInfo = props => {
  const dispatch = useDispatch();
  const [store, settings, show, limit, totalItemsCount] = useSelector(
    ({scan, settings, auth, companyItems}) => [
      scan,
      settings,
      scan.isInfoOpen,
      auth.currentCompany.plan.items,
      companyItems.totalItemsCount,
    ],
  );
  const quantity = store.scanInfo.batch ? store.scanInfo.batch.quantity : 1;
  const units = store.scanInfo.batch
    ? store.scanInfo.batch.units
    : T.t('piece');
  const error = getProperErrorMessage(store.scanInfoError, store.currentScan);
  const keyboardMarginTop = 50;
  const metaData = store.scanInfo.metadata;
  const [role, setRole] = useState();
  const [reason, setReason] = useState('');
  const [stockroom, setStockroom] = useState('');
  const [quantityToService, setQuantityForService] = useState(
    store.scanInfo.batch ? store.scanInfo.batch.quantity : 1,
  );
  const [isModalShown, setIsModalShown] = useState(false);
  const isEnteredQuantityValid =
    quantityToService <= quantity || quantityToService <= 0;
  const isFormValid = !!reason && !!stockroom && isEnteredQuantityValid;

  let nameOfProduct = '';
  if (metaData) {
    nameOfProduct = metaData.title
      ? metaData.title
      : `${metaData.type} ${metaData.brand} ${metaData.model} ${
          metaData.serial
        }`;
  }
  useEffect(() => dispatch(getTotalCountMyCompanyItems()), [totalItemsCount]);

  const againScan = () => {
    props.navigation.navigate('ServiceMenu');
    dispatch(allowNewScan(true));
  };

  const sendSercive = () => {
    if (limit > totalItemsCount) {
      dispatch(loader(true));
      dispatch(
        sendToServices(
          store.scanInfo._id,
          reason,
          stockroom,
          quantityToService,
          props.navigation,
        ),
      );
      setReason('');
      setStockroom('');
    } else {
      setIsModalShown(true);
    }
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
        goTo={settings.startPageService}
        title={T.t('send_service')}
      />
      {isModalShown && <TariffLimitModal handleClose={setIsModalShown} />}
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
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={keyboardMarginTop}>
          <View style={styles.container}>
            <View style={styles.info}>
              {store.scanInfoError && (
                <View style={styles.info}>
                  <Title style={styles.titleError}>{error}</Title>
                </View>
              )}
              {!store.scanInfoError && (
                <View style={styles.info}>
                  {/* <Title style={styles.title}>{T.t('send_service')}</Title> */}
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

                      <Text style={styles.text}>
                        {T.t('detail_quantity')}: {quantity} {units}
                      </Text>
                    </View>
                  )}
                  <ItemSetQuantityArea
                    quantity={quantity}
                    units={units}
                    isEnteredQuantityValid={isEnteredQuantityValid}
                    value={quantityToService}
                    setQuantity={setQuantityForService}
                    mode="title_service_quantity"
                  />
                </View>
              )}
            </View>
            <View style={styles.buttons}>
              {!store.scanInfoError && (
                <>
                  <TextInput
                    style={styles.textInput}
                    mode="outlined"
                    label={T.t('title_service_reason')}
                    value={reason}
                    onChangeText={text => setReason(text)}
                  />
                  <TextInput
                    style={styles.textInput}
                    mode="outlined"
                    label={T.t('title_service_place')}
                    value={stockroom}
                    onChangeText={text => setStockroom(text)}
                  />
                  <View style={styles.buttonsBlock}>
                    <View style={styles.buttonBlock}>
                      <DarkButton
                        text={T.t('send')}
                        disabled={!isFormValid}
                        onPress={sendSercive}
                      />
                    </View>
                  </View>
                </>
              )}
              <View style={styles.buttonBlock}>
                <DarkButton text={T.t('cancel')} onPress={againScan} />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
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
    paddingTop: 25,
    width: Dimensions.get('window').width / 1.1,
    backgroundColor: '#EDF6FF',
  },
  buttonBlock: {
    width: Dimensions.get('window').height / 3.3,
    textAlign: 'center',
    display: 'flex',
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonsBlock: {
    marginBottom: -20,
  },
  info: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    color: '#22215B',
    textAlign: 'center',
    paddingBottom: 5,
    fontSize: 19,
  },
  titleError: {
    color: '#E40B67',
    textAlign: 'center',
    paddingBottom: 5,
    fontSize: 19,
  },
  text: {
    fontSize: 15,
    paddingBottom: 5,
    color: '#7A7A9D',
    width: Dimensions.get('window').width / 1.3,
  },
  buttons: {
    display: 'flex',
    alignSelf: 'center',
    width: Dimensions.get('window').width / 1.5,
  },
  buttonStyle: {
    width: Dimensions.get('window').width / 1.5,
    height: Dimensions.get('window').height / 15,
  },
  textInput: {
    display: 'flex',
    alignSelf: 'center',
    height: 40,
    backgroundColor: '#EDF6FF',
    color: '#7A7A9D',
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

export default ServiceInfo;
