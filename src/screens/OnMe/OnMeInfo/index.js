import React, {useEffect, useState} from 'react';
import {isEmpty} from 'lodash';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Dialog,
  IconButton,
  Portal,
  Title,
} from 'react-native-paper';
import T from '../../../i18n';
// components
import DarkButton from '../../../components/Buttons/DarkButton';
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
import ItemCardQuantityAndPrice from '../../../components/ItemCardQuantityAndPrice';
import {getComments} from '../../../actions/commentsAction';
import Gallery from '../../../components/Gallery';
import GalleryForItem from '../../../components/Gallery/GalleryForItem';
import {addMountParent} from '../../../actions/mountActions';
import {useUserPlan} from '../../../hooks/useUserPlan';

export const OnMeInfo = props => {
  const {isNotFreePlan} = useUserPlan();
  const [scan, store, settings] = useSelector(({scan, onMe, settings}) => [
    scan,
    onMe,
    settings,
  ]);
  const itemPhotos = scan.scanInfo.photos ?? [];
  const renderedList = useSelector(({onMe}) => onMe.searchResult);
  const dispatch = useDispatch();
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [chosenPhoto, setChosenPhoto] = useState(0);
  const [photoDel, setPhotoDel] = useState(
    itemPhotos[0] ? itemPhotos[0].name : '',
  );

  useEffect(() => itemPhotos.length && setPhotoDel(itemPhotos[0].name), [
    itemPhotos,
  ]);
  const myList = store.myList.filter(item => {
    return item._id === store.myCurrentId;
  });
  const metaData = myList.length ? myList[0] : renderedList[0];
  const info = metaData?.metadata;
  const show = !isEmpty(metaData);
  let nameOfProduct = '';
  const quantity = metaData?.batch ? metaData?.batch.quantity : 1;
  const units = metaData?.batch ? metaData?.batch.units : T.t('piece');
  if (info) {
    nameOfProduct = info.title
      ? info.title
      : `${info.type} ${info.brand} ${info.model} ${info.serial}`;
  }
  const handleTransactions = () => {
    dispatch(loader(true));
    dispatch(getTransactions(metaData._id, props.navigation, 0));
  };

  const getAllComments = () => {
    dispatch(loader(true));
    dispatch(getComments(props.navigation, metaData._id, 0, 'OnMeInfo'));
  };

  const unmount = () => {
    dispatch(loader(true));
    dispatch(
      unMountItemFromParent(
        scan.scanInfo.parent._id,
        scan.scanInfo._id,
        scan.scanInfo.code,
        scan.navigation,
        'OnMeInfo',
        store.scanInfo._id,
      ),
    );
  };

  const deleteItem = () => {
    setIsDeleteItemModalOpen(false);
    dispatch(loader(true));
    dispatch(
      unMountItemFromParent(
        scan.scanInfo._id,
        [deleteId],
        scan.scanInfo.code,
        props.navigation,
        'OnMeInfo',
      ),
    );
  };
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
        goTo={'OnMe'}
        title={T.t('detail_info')}
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
      <View style={styles.body}>
        <View style={styles.container}>
          <ScrollView>
            {isNotFreePlan && (
              <GalleryForItem
                setChosenPhoto={setChosenPhoto}
                setIsGalleryOpen={setIsGalleryOpen}
                setPhotoDel={setPhotoDel}
                page="OnMeInfo"
              />
            )}
            {store.myError && (
              <View style={styles.info}>
                <Title style={styles.titleError}>ТМЦ не найден</Title>
              </View>
            )}
            {!store.myError && (
              <View style={styles.info}>
                {show && (
                  <View style={styles.info}>
                    {!!info && (
                      <Text style={styles.text}>
                        {T.t('detail_title')}: {nameOfProduct}
                      </Text>
                    )}
                    {!!info.brand && (
                      <Text style={styles.text}>
                        {T.t('detail_brand')}: {info.brand}
                      </Text>
                    )}
                    {!!info.model && (
                      <Text style={styles.text}>
                        {T.t('detail_model')}: {info.model}
                      </Text>
                    )}
                    {!!info.capacity && (
                      <Text style={styles.text}>
                        {T.t('detail_capacity')}: {info.capacity}
                      </Text>
                    )}
                    {!!info.serial && (
                      <Text style={styles.text}>
                        {T.t('detail_serial')}: {info.serial}
                      </Text>
                    )}
                    {!!info.type && (
                      <Text style={styles.text}>
                        {T.t('detail_type')}: {info.type}
                      </Text>
                    )}
                    {show
                      ? metaData.customFields.map((item, index) => {
                          return (
                            <Text key={index} style={styles.text}>
                              {item.label}: {item.value}
                            </Text>
                          );
                        })
                      : null}
                    {show && metaData.code && (
                      <Text style={styles.text}>
                        {T.t('qr_code')}: {metaData.code}
                      </Text>
                    )}
                    <ItemCardQuantityAndPrice
                      quantity={quantity}
                      price={info.price}
                      units={units}
                      styles={styles}
                    />

                    {!isEmpty(scan.scanInfo.items) && (
                      <>
                        <Text style={styles.textTmc}>
                          {T.t('om_this_setup')}
                        </Text>
                        {scan.scanInfo.items.map((item, index) => {
                          return (
                            <View key={index}>
                              <Text key={index} style={styles.textInfo}>
                                {item.metadata.title} {'\n'}
                                {item.metadata.type} {'\n'}
                                {item.metadata.brand} {'\n'}
                                {item.metadata.serial} {'\n'}
                                {item.metadata.model} {'\n'}
                                {item.code}
                              </Text>
                              <Button
                                style={styles.deleteBtn}
                                mode="text"
                                contentStyle={styles.buttonContentStyle}>
                                <IconButton
                                  {...props}
                                  icon="delete"
                                  size={35}
                                  color="#22215B"
                                  onPress={() => {
                                    setDeleteId(item._id);
                                    setIsDeleteItemModalOpen(true);
                                  }}
                                />
                              </Button>
                              <View style={styles.border} />
                            </View>
                          );
                        })}
                      </>
                    )}
                    {scan.scanInfo.parent && (
                      <>
                        <Text style={styles.textTmc}>{T.t('this_setup')}</Text>
                        <Text style={styles.text}>
                          {scan.scanInfo.parent.metadata.title},{' '}
                          {scan.scanInfo.parent.metadata.brand},{' '}
                          {scan.scanInfo.parent.metadata.model},{' '}
                          {scan.scanInfo.parent.metadata.serial}
                        </Text>
                      </>
                    )}
                  </View>
                )}
              </View>
            )}
          </ScrollView>
          {!store.myError ? (
            <>
              <View style={styles.buttonsBlock}>
                <View style={styles.buttonBlock}>
                  {!isEmpty(scan.scanInfo) &&
                    scan.scanInfo.transfer === null &&
                    !scan.scanInfo.repair && (
                      <View>
                        {!isEmpty(scan.scanInfo.parent) ? (
                          <DarkButton
                            text={T.t('dismantle')}
                            onPress={unmount}
                          />
                        ) : (
                          <DarkButton
                            text={T.t('setupItem')}
                            onPress={() => {
                              dispatch(backPageMount('OnMeInfo'));
                              dispatch(nextPageMount('MountList'));
                              dispatch(
                                nfc(
                                  'MountList',
                                  'MountList',
                                  false,
                                  'MountList',
                                  'startPageMountList',
                                  true,
                                ),
                              );
                              props.navigation.navigate('MountList');
                              dispatch(addMountParent(scan.scanInfo._id));
                            }}
                          />
                        )}
                      </View>
                    )}

                  <DarkButton
                    text={T.t('title_comments')}
                    onPress={getAllComments}
                  />

                  <DarkButton
                    text={T.t('title_history_of_transaction')}
                    onPress={handleTransactions}
                  />
                </View>
              </View>
            </>
          ) : null}
        </View>
      </View>
      <Portal>
        <Dialog
          style={styles.dialog}
          visible={isDeleteItemModalOpen}
          onDismiss={() => {
            setIsDeleteItemModalOpen(!isDeleteItemModalOpen);
          }}>
          <Dialog.Title>{T.t('delete_item')}</Dialog.Title>
          <Dialog.Actions>
            <Button onPress={() => deleteItem()}>{T.t('delete')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  info: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: Dimensions.get('window').height / 15,
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
    bottom: 40,
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
  textTmc: {
    fontSize: 16,
    marginTop: 20,
    paddingBottom: 10,
    color: '#22215B',
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
  dialog: {
    backgroundColor: '#EDF6FF',
  },
});

export default OnMeInfo;
