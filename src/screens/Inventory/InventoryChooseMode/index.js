import React, {useEffect, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import T from '../../../i18n';
import {Card, Snackbar} from 'react-native-paper';

import TransparentButton from '../../../components/Buttons/TransparentButton';
import Appbar from '../../../components/Appbar';
import DarkButton from '../../../components/Buttons/DarkButton';
import ItemListCard from '../../../components/ItemListCard';

import {
  addItemInInventory,
  allowNewScan,
  clearGiveList,
  clearInventory,
  deleteItem,
  loader,
  makeInventory,
  runInvetory,
  saveInventoryItem,
} from '../../../actions/actions';
import {getInventoryMesageError, handleNavigateToSingleItemPage} from '../../../utils/helpers';
import {SAVE_KIT_TMC} from '../../../actions/actionsType';

const InventoryChooseMode = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [settings, inventory, scan] = useSelector(({settings, inventory, scan}) => [
    settings,
    inventory,
    scan,
  ]);
  const [error, setError] = useState('');

  const setQtyItem = itemId => inventory.inventoryQuantityList.find(pc => pc.id === itemId);

  const isAlreadyScaned = id => inventory.inventoryScanList.find(item => item._id === id);
  const renderedList = [...inventory.inventoryScanList, ...inventory.addedItems];
  const reversedRenderList = renderedList.reverse();
  const itemsInventoriedQty = renderedList.length > 0 ? `(${renderedList.length})` : '';

  const isSetQtyBtnShown = item =>
    item.batch &&
    !item.uuid &&
    item._id &&
    item.createdAt &&
    // !item.metadata.quantity &&
    item.batch.quantity &&
    // +item.batch.quantity !== 1 &&
    !setQtyItem(item._id);

  useEffect(() => {
    if (scan.scanInfoError !== 'InRepair' && scan.scanInfoError !== 'IsBan') {
      setError(getInventoryMesageError(scan.scanInfoError, scan.currentScan));
    }
    if (scan.scanInfoError === 'InRepair') {
      setError(`${T.t('item')}  "${scan.selectGiveId}" ${T.t('error_services')}`);
    }
    let isDuplicate = isAlreadyScaned(scan.selectGiveId);
    if (isDuplicate) {
      setError(getInventoryMesageError('Duplicate', scan.currentScan));
    }
    if (
      !isAlreadyScaned(scan.selectGiveId) &&
      scan.scanInfoError !== 'NotFound' &&
      Object.keys(scan.scanInfo).length > 0
    ) {
      dispatch(saveInventoryItem([...inventory.inventoryScanList, scan.scanInfo]));
      const normalizedItem = [
        {
          id: scan.scanInfo._id,
          quantity: scan.scanInfo?.batch?.quantity || '1',
        },
      ];
      if (inventory?.currentInventoryUser) {
        if (inventory.inventoryId) {
          dispatch(addItemInInventory(inventory.inventoryId, normalizedItem, ''));
        } else {
          dispatch(makeInventory(inventory.currentInventoryUser, normalizedItem, ''));
        }
      }
    }
  }, [scan]);

  const findInventoryItem = () => {
    navigation.navigate(settings.startPageInventory);
    dispatch(allowNewScan(true));
  };

  const inventorsItemIdAndQty = inventory.inventoryScanList
    .filter(item => !inventory.inventoryQuantityList.find(pc => pc.id === item._id))
    .map(item => ({
      id: item._id,
      quantity: item.batch ? item.batch.quantity : 1,
    }));

  const normalizedAddedItems = inventory.addedItems.map(item => ({
    type: item.metadata.type,
    title: item.metadata.title,
    brand: item.metadata.brand,
    model: item.metadata.model,
    serial: item.metadata.serial,
    quantity: item.batch.quantity,
  }));

  const normalizedKitItems = inventory.itemsKit.map(item => ({
    id: item._id,
    quantity: item?.batch?.quantity || '1',
  }));

  useEffect(() => {
    if (inventory.itemsKit.length) {
      dispatch(addItemInInventory(inventory.inventoryId, normalizedKitItems));
    }
  }, [inventory.itemsKit, inventory.inventoryId]);

  useEffect(() => {
    if (scan.scanInfo?.items?.length) {
      dispatch({
        type: SAVE_KIT_TMC,
        payload: {itemsKit: scan.scanInfo.items, inventoryScanList: scan.scanInfo.items},
      });
    }
  }, [scan.scanInfo]);

  const handleEndInventory = () => {
    navigation.navigate('Home');
    dispatch(clearGiveList());
    dispatch(allowNewScan(true));
    dispatch(loader(true));
    // dispatch(
    //   makeStocktaking(
    //     inventory.currentInventoryUser,
    //     [...inventory.inventoryQuantityList, ...inventorsItemIdAndQty],
    //     normalizedAddedItems,
    //     navigation,
    //   ),
    // );
    dispatch(runInvetory(inventory.inventoryId, navigation));
    dispatch(clearInventory());
  };

  const saveInventorySession = () => {
    navigation.navigate('Home');
    dispatch(clearInventory());
  };

  const correctItems = item => {
    const uid = inventory.itemsUuid.filter(i => i.id === item._id);
    handleNavigateToSingleItemPage(item.code, navigation, item._id, 'SetInventoryQty', dispatch);
    dispatch(deleteItem(inventory.inventoryId, uid));
  };

  return (
    <View style={styles.body}>
      <Appbar
        navigation={navigation}
        arrow={true}
        newScan={true}
        clearMarking={true}
        clearInventory={true}
        goTo={'Inventory'}
        isMutiple={true}
        title={T.t('inventori')}
        isSearchForGiveItem={false}
      />
      <ScrollView contentContainerStyle={styles.cards}>
        {reversedRenderList.length > 0 &&
          reversedRenderList.map(item => (
            <Card style={styles.card} key={item._id}>
              <ItemListCard item={item} isPriceShown={false} isStocktaking={true} />
              <View style={styles.setQtyBtn}>
                {isSetQtyBtnShown(item) && (
                  <DarkButton onPress={() => correctItems(item)} text={T.t('set_quantity')} />
                )}
              </View>
              {setQtyItem(item._id) && (
                <Card.Content style={styles.editArea}>
                  <Text style={styles.cardTitle}>
                    {T.t('current_inventori_qty')}: {setQtyItem(item._id).quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      // handleNavigateToSingleItemPage(
                      //   item.code,
                      //   navigation,
                      //   item._id,
                      //   'SetInventoryQty',
                      //   dispatch,
                      // );
                      correctItems(item);
                      // dispatch(deleteItem(inventory.inventoryId, item._id));
                    }}>
                    <Text style={styles.edit}>Edit</Text>
                  </TouchableOpacity>
                </Card.Content>
              )}
            </Card>
          ))}
      </ScrollView>
      <View style={styles.btns}>
        <TransparentButton
          onPress={findInventoryItem}
          text={`${T.t('search')} ${T.t('qr_code')}`}
        />
        <TransparentButton
          onPress={() => navigation.navigate('CreateInventoryItem')}
          text={`${T.t('create')} ${T.t('qr_code')}`}
        />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={saveInventorySession}
            disabled={renderedList.length === 0}
            style={{
              padding: 17,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#2D2C71',
              width: Dimensions.get('window').width / 2.3,
              margin: 5,
            }}>
            <Text
              style={{
                textAlign: 'center',
                padding: 5,
                borderRadius: 40,
              }}>
              {`На паузу${itemsInventoriedQty}`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleEndInventory}
            style={{
              padding: 10,
              borderRadius: 10,
              backgroundColor: '#2D2C71',
              width: Dimensions.get('window').width / 2.3,
              margin: 5,
            }}>
            <Text
              style={{
                textAlign: 'center',
                padding: 5,
                borderRadius: 40,
                color: '#ffffff',
              }}>
              {`${T.t('finish_inventory')}${itemsInventoriedQty}`}
            </Text>
          </TouchableOpacity>
        </View>
        {/*<View style={styles.buttonsContainer}>*/}
        {/*  <TransparentButton*/}
        {/*    onPress={saveInventorySession}*/}
        {/*    text={`На паузу${itemsInventoriedQty}`}*/}
        {/*  />*/}
        {/*  <DarkButton*/}
        {/*    onPress={handleEndInventory}*/}
        {/*    disabled={renderedList.length === 0}*/}
        {/*    text={`${T.t('finish_inventory')}${itemsInventoriedQty}`}*/}
        {/*  />*/}
        {/*</View>*/}
      </View>
      <Snackbar
        visible={error}
        onDismiss={() => {
          setError('');
        }}
        action={{
          label: T.t('close'),
          onPress: () => {
            setError('');
          },
        }}>
        {error}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height,
  },
  buttonsContainer: {
    // flex: 1,
    width: Dimensions.get('window').width / 1.8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // margin: 10,
  },
  cards: {
    marginTop: -10,
    paddingTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 15,
    backgroundColor: '#EDF6FF',
    color: '#22215B',
    borderRadius: 10,
    paddingBottom: 10,
  },
  btns: {
    width: Dimensions.get('window').width / 1.1,
    alignSelf: 'center',
    marginBottom: 25,
  },
  titleError: {
    color: '#E40B67',
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  setQtyBtn: {
    width: Dimensions.get('window').width / 2.2,
    alignSelf: 'center',
  },
  editArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cardTitle: {
    fontSize: 14,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#22215B',
  },
  edit: {
    color: '#8c03fc',
  },
});

export default InventoryChooseMode;
