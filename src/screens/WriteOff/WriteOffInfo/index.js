import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  FlatList,
  ScrollView,
} from 'react-native';
import {ActivityIndicator, Button, Menu, Portal, Title} from 'react-native-paper';
import T from '../../../i18n';
// components
import Appbar from '../../../components/Appbar';
import DarkButton from '../../../components/Buttons/DarkButton';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  allowNewScan,
  loader,
  sendToWriteOff,
} from '../../../actions/actions.js';
import {getProperErrorMessage, getStatus} from '../../../utils/helpers.js';
import ItemSetQuantityArea from '../../../components/ItemSetQuantityArea';
import {useUserData} from '../../../hooks/useUserData';
import Arrow from "../../../assets/svg/arrow-down.svg";
import {getLocations} from "../../../actions/actions";

export const WriteOffInfo = props => {
  const dispatch = useDispatch();
  const [visibleObject, setVisibleObject] = useState(false);
  const [visibleLocation, setVisibleLocation] = useState(false);
  const [formObjectValues, setFormObjectValues] = useState('');
  const [formLocationValues, setFormLocationValues] = useState('');
  const [indexObject, setIndexObject] = useState(0);
  const [store, settings] = useSelector(({scan, settings}) => [scan, settings]);
  const error = getProperErrorMessage(store.scanInfoError, store.currentScan);
  const show = store.isInfoOpen;
  const metaData = store.scanInfo.metadata;
  const quantity = store.scanInfo.batch ? store.scanInfo.batch.quantity : 1;
  const units = store.scanInfo.batch
    ? store.scanInfo.batch.units
    : T.t('piece');
  const {role} = useUserData();
  const [quantityToWireOff, setQuantityToWireOff] = useState(1);
  const isEnteredQuantityValid =
    quantityToWireOff <= quantity || quantityToWireOff <= 0;

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
    dispatch(
      sendToWriteOff(store.scanInfo._id, props.navigation, quantityToWireOff, formObjectValues, formLocationValues),
    );
    setFormObjectValues('');
    setFormLocationValues('');
  };

  const againScan = () => {
    props.navigation.navigate(settings.startPageWriteOff);
    dispatch(allowNewScan(true));
    setFormObjectValues('');
    setFormLocationValues('');
    setIndexObject(0);
  };

  const location = settings.locations[`${indexObject}`].locations;

  const handleOpenObject = () => {
    setVisibleObject(!visibleObject);
    setFormLocationValues('');
  }

  const handleObject = (item) => {
    setVisibleObject(!visibleObject);
    setFormObjectValues(item.item.title);
    setIndexObject(item.index);
  }

  const renderItemObject = item => (
    <Menu.Item onPress={() => handleObject(item)} title={item.item.title} />
  );

  const handleLocation = (item) => {
    setVisibleLocation(!visibleLocation);
    setFormLocationValues(item.item);
  };

  useEffect(() => dispatch(getLocations()), []);
  const renderItemLocations = (item) => (
    <Menu.Item onPress={()=>handleLocation(item)} title={item.item} />
  );

  return (
    <>
      <Appbar
        navigation={props.navigation}
        newScan={true}
        arrow={true}
        goTo={settings.startPageWriteOff}
        title={T.t('title_ban_question')}
      />
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
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView style={styles.list}>
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
                  <Title style={styles.title}>
                    {T.t('title_ban_question')}?
                  </Title>
                  <Menu
                    visible={visibleObject}
                    anchor={
                      <Button onPress={handleOpenObject} >
                        {formObjectValues ? (formObjectValues) : ('Выбор обьекта') }{' '}
                        <View style={styles.arrowWrap}>
                          <Arrow width={10} height={10} />
                        </View>
                      </Button>
                    }>
                    <View style={styles.list}>
                    <FlatList
                      data={settings.locations}
                      keyExtractor={item => item._id}
                      renderItem={renderItemObject}
                    />
                  </View>
                  </Menu>
                  {location.length > 0 ? (<Menu
                    visible={visibleLocation}
                    anchor={
                      <Button onPress={() => setVisibleLocation(!visibleLocation)}>
                        {formLocationValues ? (formLocationValues) : ('Выбор локации')}{' '}
                        <View style={styles.arrowWrap}>
                          <Arrow width={10} height={10} />
                        </View>
                      </Button>
                    }>
                    <View style={styles.list}>
                      <FlatList
                        data={location}
                        keyExtractor={item => item}
                        renderItem={renderItemLocations}
                      />
                    </View>
                  </Menu>) : null}
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
                    value={quantityToWireOff}
                    setQuantity={setQuantityToWireOff}
                    mode="title_write_off_quantity"
                  />
                </View>
              )}
            </View>
            <View style={styles.buttons}>
              {!store.scanInfoError && (
                <View style={styles.buttonBlock}>
                  <DarkButton
                    text={T.t('ban_btn')}
                    onPress={writteOff}
                    disabled={!isEnteredQuantityValid}
                  />
                </View>
              )}
              <View style={styles.buttonBlock}>
                <DarkButton text={T.t('cancel')} onPress={againScan} />
              </View>
            </View>
          </View>
        </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  body: {
    flex: 1,
    marginTop: -10,
    display: 'flex',
    paddingTop: 30,
    alignItems: 'center',
    backgroundColor: '#D3E3F2',
    // height: Dimensions.get('window').height,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 10,
    paddingBottom: 10,
    paddingTop: 20,
    width: Dimensions.get('window').width / 1.1,
    backgroundColor: '#EDF6FF',
  },
  buttonBlock: {
    width: Dimensions.get('window').height / 2.7,
    textAlign: 'center',
  },
  info: {
    display: 'flex',
    alignItems: 'center',
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
  arrowWrap: {
    marginBottom: -1,
  },
});

export default WriteOffInfo;
