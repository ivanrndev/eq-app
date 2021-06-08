/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Button, Dialog, IconButton, Portal} from 'react-native-paper';
import {isEmpty} from 'lodash';
// components
import Appbar from '../../../components/Appbar';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  backPageMount,
  getTransactions,
  loader,
  nextPageMount,
  nfc,
  unMountItemFromParent,
} from '../../../actions/actions.js';
import T from '../../../i18n';
import {fontSizer, getStatus} from '../../../utils/helpers.js';
import AsyncStorage from '@react-native-community/async-storage';
import DarkButton from '../../../components/Buttons/DarkButton';
import ItemCardQuantityAndPrice from '../../../components/ItemCardQuantityAndPrice';
import {getComments} from '../../../actions/commentsAction';
import GalleryForItem from '../../../components/Gallery/GalleryForItem';
import Gallery from '../../../components/Gallery';
import {addMountParent} from '../../../actions/mountActions';

export const IdentInfo = props => {
  const dispatch = useDispatch();
  const [settings, store, currentCompany] = useSelector(
    ({settings, scan, auth}) => [settings, scan, auth.currentCompany],
  );
  const metaData = store.scanInfo.metadata;
  const width = Dimensions.get('window').width;
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const [role, setRole] = useState();
  const [userId, setUserId] = useState();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [chosenPhoto, setChosenPhoto] = useState(0);

  const itemPhotos = store.scanInfo.photos ?? [];
  let nameOfProduct = '';
  if (metaData) {
    nameOfProduct = metaData.title
      ? metaData.title
      : `${metaData.type} ${metaData.brand} ${metaData.model} ${
          metaData.serial
        }`;
  }
  const [photoDel, setPhotoDel] = useState(
    itemPhotos[0] ? itemPhotos[0].name : '',
  );

  const plan =
    currentCompany && currentCompany.plan ? currentCompany.plan.title : '';
  const isNotFreePlan =
    plan === 'optimal' || plan === 'optimal +' || plan === 'premium';
  let itemId = store.scanInfo._id;
  const quantity = store.scanInfo.batch ? store.scanInfo.batch.quantity : 1;
  const price = store.scanInfo.metadata && store.scanInfo.metadata.price;
  const units = store.scanInfo.batch
    ? store.scanInfo.batch.units
    : T.t('piece');
  const getAllComments = () => {
    dispatch(loader(true));
    dispatch(getComments(props.navigation, itemId, 0, 'IdentInfo'));
  };

  const handleTransactions = () => {
    dispatch(loader(true));
    dispatch(getTransactions(itemId, props.navigation, 0));
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

  const getUserId = async () => {
    try {
      const value = await AsyncStorage.getItem('userId');
      if (value !== null) {
        setUserId(value);
      }
    } catch (e) {
      console.log('no role');
    }
  };
  getUserId();

  const deleteItem = () => {
    setIsOpen(false);
    dispatch(loader(true));
    dispatch(
      unMountItemFromParent(
        store.selectGiveId,
        [deleteId],
        store.scanInfo.code,
        props.navigation,
        'IdentInfo',
      ),
    );
  };

  const unmount = () => {
    dispatch(loader(true));
    dispatch(
      unMountItemFromParent(
        store.scanInfo.parent._id,
        itemId,
        store.scanInfo.code,
        props.navigation,
        'IdentInfo',
      ),
    );
  };

  const personId = store.scanInfo.person ? store.scanInfo.person._id : null;
  const gaveAcess = userId === personId;

  const handleCloseGallery = () => {
    setIsGalleryOpen(false);
    setChosenPhoto(0);
  };

  return (
    <>
      <Appbar
        navigation={props.navigation}
        newScan={true}
        arrow={true}
        goTo={settings.startPageIdent}
        title={T.t('detail_info')}
      />

      <View style={styles.body}>
        {store.scanInfoError === 'NotFound' && (
          <View style={styles.notFoundContainer}>
            <Text style={styles.notFoundText}>
              {`${T.t('error_code_incorrect')} "${store.currentScan}" ${T.t(
                'error_not_found',
              )}`}
            </Text>
          </View>
        )}
        {metaData && (
          <View style={styles.container}>
            <ScrollView>
              <View style={styles.info}>
                {store.scanInfoError === 'NotFound' && (
                  <Text style={styles.notFoundText}>
                    {`${T.t('error_code_incorrect')} "${
                      store.currentScan
                    }" ${T.t('error_not_found')}`}
                  </Text>
                )}
                {isNotFreePlan && (
                  <GalleryForItem
                    setChosenPhoto={setChosenPhoto}
                    setIsGalleryOpen={setIsGalleryOpen}
                    setPhotoDel={setPhotoDel}
                    page="IdentInfo"
                  />
                )}
                {store.scanInfo && (
                  <Text style={styles.text}>
                    {T.t('transfer_status')}: {getStatus(store.scanInfo, role)}
                  </Text>
                )}
                <Text style={styles.text}>
                  {T.t('detail_title')}: {nameOfProduct}
                </Text>
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
                {metaData.object && (
                  <Text style={styles.text}>
                    {T.t('object')}: {metaData.object}
                  </Text>
                )}
                {!!metaData.location && (
                  <Text style={styles.text}>
                    {T.t('location')}: {metaData.location}
                  </Text>
                )}
                <ItemCardQuantityAndPrice
                  quantity={quantity}
                  price={price}
                  units={units}
                  styles={styles}
                />
                {!isEmpty(store.scanInfo.items) && (
                  <>
                    <Text style={styles.textTmc}>{T.t('om_this_setup')}</Text>
                    {store.scanInfo.items.map((item, index) => {
                      return (
                        <View key={index}>
                          <Text key={index} style={styles.textInfo}>
                            {item.metadata.title}
                            {'\n'}
                            {item.metadata.type}
                            {'\n'}
                            {item.metadata.brand}
                            {'\n'}
                            {item.metadata.serial}
                            {'\n'}
                            {item.metadata.model}
                            {'\n'}
                            {item.code}
                          </Text>
                          <Button
                            style={styles.deleteBtn}
                            mode="text"
                            contentStyle={styles.buttonContentStyle}>
                            {gaveAcess && (
                              <IconButton
                                {...props}
                                icon="delete"
                                size={35}
                                color="#22215B"
                                onPress={() => {
                                  setDeleteId(item._id);
                                  setIsOpen(true);
                                }}
                              />
                            )}
                          </Button>
                          <View style={styles.border} />
                        </View>
                      );
                    })}
                  </>
                )}
                {store.scanInfo.parent && (
                  <>
                    <Text style={styles.textTmc}>{T.t('this_setup')}</Text>
                    <Text style={styles.text}>
                      {store.scanInfo.parent.metadata.title},{' '}
                      {store.scanInfo.parent.metadata.brand},{' '}
                      {store.scanInfo.parent.metadata.model},{' '}
                      {store.scanInfo.parent.metadata.serial}
                    </Text>
                  </>
                )}
              </View>
            </ScrollView>

            <View style={styles.buttonsBlock}>
              <View style={styles.buttonBlock}>
                {gaveAcess &&
                  !isEmpty(store.scanInfo) &&
                  store.scanInfo.transfer === null &&
                  !store.scanInfo.repair && (
                    <View>
                      {!isEmpty(store.scanInfo.parent) ? (
                        <DarkButton
                          size={fontSizer(width)}
                          text={T.t('dismantle')}
                          onPress={unmount}
                        />
                      ) : (
                        <DarkButton
                          size={fontSizer(width)}
                          text={T.t('setupItem')}
                          onPress={() => {
                            dispatch(backPageMount('IdentInfo'));
                            dispatch(nextPageMount('MountList'));
                            dispatch(
                              nfc(
                                settings.nfcBack,
                                settings.nfcNext,
                                false,
                                'Ident',
                                'startPageMountList',
                                true,
                              ),
                            );

                            dispatch(addMountParent(store.scanInfo._id));
                            props.navigation.navigate('MountList');
                          }}
                        />
                      )}
                    </View>
                  )}

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
          </View>
        )}
        <Portal>
          <Dialog
            style={styles.dialog}
            visible={isOpen}
            onDismiss={() => {
              setIsOpen(!isOpen);
            }}>
            <Dialog.Title>{T.t('delete_item')}</Dialog.Title>
            <Dialog.Actions>
              <Button onPress={() => deleteItem()}>{T.t('delete')}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
      <Gallery
        photoList={itemPhotos}
        chosenPhoto={chosenPhoto}
        handlePortalClose={handleCloseGallery}
        isPortalOpen={isGalleryOpen}
        setChosenPhoto={setChosenPhoto}
        setPhotoDel={setPhotoDel}
        photoDel={photoDel}
      />
    </>
  );
};

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: '#EDF6FF',
  },
  body: {
    display: 'flex',
    marginTop: -15,
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height,
  },
  buttonsBlock: {
    alignSelf: 'center',
    bottom: -10,
  },
  buttonBlock: {
    width: Dimensions.get('window').width / 1.2,
    textAlign: 'center',
    backgroundColor: '#EDF6FF',
    marginBottom: 10,
  },
  container: {
    backgroundColor: '#EDF6FF',
    borderRadius: 10,
    height: Dimensions.get('window').height / 1.3,
    margin: 20,
    marginTop: 35,
    paddingBottom: 20,
  },
  notFoundContainer: {
    borderRadius: 10,
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
  notFoundText: {
    color: '#E40B67',
    fontSize: 20,
    paddingBottom: 5,
    width: Dimensions.get('window').width / 1.3,
  },
  text: {
    fontSize: 16,
    paddingBottom: 5,
    color: '#7A7A9D',
    width: Dimensions.get('window').width / 1.3,
  },
  textInfo: {
    fontSize: 16,
    paddingBottom: 5,
    paddingLeft: 15,
    color: '#7A7A9D',
    width: Dimensions.get('window').width / 1.3,
    height: 'auto',
  },
  textTmc: {
    fontSize: 16,
    marginTop: 20,
    paddingBottom: 10,
    color: '#22215B',
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
  deleteBtn: {
    alignSelf: 'flex-end',
    width: 20,
    marginTop: -60,
    marginRight: 0,
    paddingLeft: 14,
    marginBottom: 10,
    height: Dimensions.get('window').height / 15,
  },
  buttonContentStyle: {
    marginLeft: -13,
  },
  border: {
    width: Dimensions.get('window').width / 1.2,
    height: 1,
    backgroundColor: 'gray',
    marginBottom: 10,
    marginLeft: 15,
  },
});

export default IdentInfo;
