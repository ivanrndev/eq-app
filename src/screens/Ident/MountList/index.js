/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Button,
  Card,
  Dialog,
  IconButton,
  Portal,
  Snackbar,
} from 'react-native-paper';
import {isEmpty} from 'lodash';
// components
import Appbar from '../../../components/Appbar';
import MountScanner from '../../../components/MountScanner';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  loader,
  mountCameraList,
  mountItemFromParent,
  searchMyCompanyItems,
  unMountItemFromParent,
} from '../../../actions/actions.js';
import T from '../../../i18n';
import DarkButton from '../../../components/Buttons/DarkButton';
import {
  fontSizer,
  getProperErrorTransfer,
  handleNavigateToSingleItemPage,
} from '../../../utils/helpers.js';
import AsyncStorage from '@react-native-community/async-storage';
import {
  addItemToMountList,
  deleteItemFromMountList,
  mountItems,
} from '../../../actions/mountActions';
import ItemListCard from '../../../components/ItemListCard';
import {TouchableOpacity} from 'react-native-gesture-handler';

export const MountList = props => {
  const dispatch = useDispatch();
  const [
    store,
    settings,
    companyItemList,
    mountList,
    mountListWithQty,
  ] = useSelector(({scan, settings, companyItems, mountList}) => [
    scan,
    settings,
    companyItems.myCompanyList,
    scan.mountList,
    scan.mountListWithQty,
  ]);
  const width = Dimensions.get('window').width;
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const editItems = store.scanInfo.items;
  const [isText, setIsText] = useState('');
  const [userId, setUserId] = useState();
  const setItemQty = itemId => mountListWithQty.find(pc => pc.id === itemId);
  const isQtyBtnShow = item =>
    item.batch && +item.batch.quantity !== 1 && !setItemQty(item._id);

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
  const mountListWithQtyIds = mountListWithQty.map(item => item.id);
  const list =
    mountListWithQty.length > 0
      ? mountList
          .filter(item => !mountListWithQtyIds.includes(item._id))
          .map(item => ({
            id: item._id,
            quantity: item.batch ? item.batch.quantity : 1,
          }))
      : mountList.map(item => ({
          id: item._id,
          quantity: item.batch ? item.batch.quantity : 1,
        }));

  useEffect(() => {
    const personId = store.mountScanInfo.person
      ? store.mountScanInfo.person._id
      : null;
    const gaveAcess = userId === personId;

    const newItem = store.mountScanInfo._id;
    const checkInArray =
      !isEmpty(editItems) && editItems.map(i => i._id).includes(newItem)
        ? 'DuplicateMount'
        : false;

    const inComplect =
      (store.mountScanInfo.items && !isEmpty(store.mountScanInfo.items)) ||
      (store.mountScanInfo.parent && !isEmpty(store.mountScanInfo.parent));

    if (inComplect) {
      setIsText(T.t('inComplect'));
    }

    const isParent = store.mountScan === store.currentScan;
    if (isParent) {
      setIsText(T.t('parentError'));
    }
    if (store.mountError.length > 0) {
      setIsText(store.mountError);
    }
    const itemError = getProperErrorTransfer(
      store.mountError || checkInArray,
      store.mountScan,
    );
    if (!isEmpty(itemError)) {
      setIsText(itemError);
    }

    if (!isText && gaveAcess) {
      dispatch(
        mountItemFromParent(
          store.scanInfo._id,
          newItem,
          store.currentScan,
          props.navigation,
          'MountList',
        ),
      );
    }
  }, [store.mountScanInfo, store.mountError]);

  const [scaner, setScaner] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setScaner(true);
      return () => {
        setIsText('');
        setScaner(false);
      };
    }, []),
  );
  const handleChangeQty = item => {
    dispatch(loader(true));
    handleNavigateToSingleItemPage(
      item.code,
      props.navigation,
      item._id,
      'MountItemQty',
      dispatch,
    );
  };
  const handleUnMountItem = () => {
    setIsOpen(false);
    setIsText('');
    dispatch(loader(true));
    dispatch(
      unMountItemFromParent(
        store.scanInfo._id,
        [deleteId],
        store.scanInfo.code,
        props.navigation,
        'MountList',
      ),
    );
  };

  const handleDeleteItemFromMountList = id =>
    dispatch(deleteItemFromMountList(id));

  const handleMount = () => {
    dispatch(loader(true));
    dispatch(
      mountItems(
        store.currentParent,
        [...list, ...mountListWithQty],
        props.navigation,
        settings.backPageMount,
      ),
    );
  };

  return (
    <>
      <Appbar
        navigation={props.navigation}
        newScan={false}
        arrow={true}
        goTo="OnMe"
        backPageMount={true}
        title={T.t('setupItem')}
        switch={true}
        typeSwitchNFC={true}
        search={true}
        list={companyItemList}
        listAction={searchMyCompanyItems}
        onSelectAction={addItemToMountList}
      />
      <SafeAreaView />
      <View style={styles.container}>
        <View style={styles.scaner}>
          {scaner && (
            <MountScanner
              nav={props.navigation}
              page={'MountList'}
              saveItems={false}
            />
          )}
        </View>
        <ScrollView style={styles.bottom}>
          <View style={styles.allBtn}>
            <DarkButton
              size={fontSizer(width)}
              text={T.t('done')}
              onPress={handleMount}
            />
          </View>
          <View style={styles.cardBlock}>
            {!isEmpty(editItems) &&
              editItems.map((item, index) => (
                <Card.Title
                  key={index}
                  style={styles.card}
                  title={`${item.metadata.title ? item.metadata.title : ''}`}
                  subtitle={`${
                    item.metadata.type ? item.metadata.type + ',' : ''
                  } ${item.metadata.brand ? item.metadata.brand + ',' : ''} ${
                    item.metadata.model ? item.metadata.model : ''
                  } ${item.metadata.serial ? item.metadata.serial : ''}`}
                  right={props => (
                    <IconButton
                      {...props}
                      icon="delete"
                      onPress={() => {
                        setDeleteId(item._id);
                        setIsOpen(true);
                      }}
                    />
                  )}
                />
              ))}
            {!isEmpty(mountList) &&
              mountList.map(item => (
                <Card style={styles.card} key={item._id}>
                  <ItemListCard item={item} isPriceShown={false}>
                    <IconButton
                      icon="delete"
                      onPress={() => handleDeleteItemFromMountList(item._id)}
                      style={styles.cornerBtn}
                    />
                    {setItemQty(item._id) && (
                      <View style={styles.giveArea}>
                        <Text style={styles.cardTitle}>
                          {T.t('detail_quantity')}:{' '}
                          {setItemQty(item._id) &&
                            setItemQty(item._id).quantity}
                        </Text>
                        <TouchableOpacity onPress={() => handleChangeQty(item)}>
                          <Text style={styles.edit}>Edit</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    <View style={styles.setQtyBtn}>
                      {isQtyBtnShow(item) && (
                        <DarkButton
                          onPress={() => handleChangeQty(item)}
                          text={T.t('set_quantity')}
                        />
                      )}
                    </View>
                  </ItemListCard>
                </Card>
              ))}
          </View>
        </ScrollView>
        <Portal>
          <Dialog
            style={styles.dialog}
            visible={isOpen}
            onDismiss={() => {
              setIsOpen(!isOpen);
            }}>
            <Dialog.Title>{T.t('delete_item')}</Dialog.Title>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  dispatch(mountCameraList([], ''));
                  handleUnMountItem();
                }}>
                {T.t('delete')}
              </Button>
            </Dialog.Actions>
          </Dialog>
          <Snackbar
            visible={!!isText.length}
            onDismiss={() => {
              setIsText('');
            }}
            action={{
              label: T.t('close'),
              onPress: () => {
                setIsText('');
              },
            }}>
            {isText}
          </Snackbar>
        </Portal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: '#EDF6FF',
  },
  allBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: Dimensions.get('window').width / 1.1,
  },
  buttonBlock: {
    width: Dimensions.get('window').width / 2,
    paddingLeft: 10,
    paddingRight: 10,
  },
  container: {
    backgroundColor: '#EDF6FF',
    borderRadius: 10,
    height: Dimensions.get('window').height,
    paddingBottom: 20,
  },
  info: {
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
  deleteBtn: {
    alignSelf: 'flex-end',
    width: 20,
    marginTop: -30,
    marginRight: -20,
    paddingLeft: 14,
    marginBottom: 10,
  },
  scaner: {
    height: Dimensions.get('window').height / 2,
    backgroundColor: 'gray',
  },
  card: {
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 15,
    backgroundColor: '#EDF6FF',
    position: 'relative',
  },
  cardTitle: {
    fontSize: 13,
    textTransform: 'uppercase',
    color: '#22215B',
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 15,
    color: '#22215B',
  },
  cardBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width / 1,
    marginBottom: 90,
  },
  bottom: {
    backgroundColor: '#D3E3F2',
  },
  giveArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  edit: {
    color: '#8c03fc',
  },
  cornerBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export default MountList;
