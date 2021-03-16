import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import T from '../../../i18n';
import {Title, TextInput, Portal, ActivityIndicator} from 'react-native-paper';
// components
import Appbar from '../../../components/Appbar';
import DarkButton from '../../../components/Buttons/DarkButton';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  allowNewScan,
  sendToServices,
  loader,
} from '../../../actions/actions.js';
import {getStatus, getProperErrorMessage} from '../../../utils/helpers.js';
import AsyncStorage from '@react-native-community/async-storage';
import {useQuantityAndPrice} from '../../../hooks/useQuantityAndPrice';

export const ServiceInfo = props => {
  const dispatch = useDispatch();
  const [store, settings, show] = useSelector(({scan, settings}) => [
    scan,
    settings,
    scan.isInfoOpen,
  ]);
  const {quantity, units} = useQuantityAndPrice();
  const error = getProperErrorMessage(store.scanInfoError, store.currentScan);
  // const keyboardMarginTop = Dimensions.get('window').height / 15;
  const keyboardMarginTop = 50;
  const metaData = store.scanInfo.metadata;
  const [role, setRole] = useState();
  const [reason, setReason] = useState('');
  const [stockroom, setStockroom] = useState('');
  const [quantityToService, setQuantityToService] = useState(quantity);
  const isEnteredQuantityValid = quantityToService <= quantity;
  const isFormValid = !!reason && !!stockroom && isEnteredQuantityValid;

  let nameOfProduct = '';
  if (metaData) {
    nameOfProduct = metaData.title
      ? metaData.title
      : `${metaData.type} ${metaData.brand} ${metaData.model} ${
          metaData.serial
        }`;
  }

  const againScan = () => {
    props.navigation.navigate('ServiceMenu');
    dispatch(allowNewScan(true));
  };

  const sendSercive = () => {
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

                  {quantity > 1 && (
                    <>
                      <Text style={styles.text}>
                        {T.t('title_service_quantity')}
                      </Text>
                      <View style={styles.quantityInputWrap}>
                        <TextInput
                          style={styles.quantityInput}
                          mode="outlined"
                          value={`${quantityToService}`}
                          keyboardType="numeric"
                          onChangeText={text => setQuantityToService(text)}
                        />
                        <Text style={styles.quantityUnits}>{T.t('piece')}</Text>
                      </View>
                      <Text style={styles.error}>
                        {!isEnteredQuantityValid &&
                          `Указанное значение превышает \nдоступный остаток, операция не может\nбыть совершена.`}
                      </Text>
                    </>
                  )}
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
  error: {
    color: '#E40B67',
    alignSelf: 'flex-start',
    fontSize: 15,
    marginVertical: 10,
    height: 60,
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
  quantityInputWrap: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  quantityUnits: {
    fontSize: 15,
    color: '#7A7A9D',
  },
  quantityInput: {
    height: 50,
    width: 100,
    marginRight: 10,
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
