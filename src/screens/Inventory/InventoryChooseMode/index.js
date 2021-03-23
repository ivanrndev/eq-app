import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import T from '../../../i18n';
import {Card, Snackbar, Title} from 'react-native-paper';

import TransparentButton from '../../../components/Buttons/TransparentButton';
import Appbar from '../../../components/Appbar';
import DarkButton from '../../../components/Buttons/DarkButton';
import ItemListCard from '../../../components/ItemListCard';

import {
  allowNewScan,
  alreadyScanned,
  clearGiveList,
  clearInventory,
  loader,
  makeStocktaking,
  setInventoryItemsQty,
} from '../../../actions/actions';
import {
  getInventoryMesageError,
  handleNavigateToSingleItemPage,
} from '../../../utils/helpers';

const InventoryChooseMode = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [settings, inventory, scan] = useSelector(
    ({settings, inventory, scan}) => [settings, inventory, scan],
  );
  const [error, setError] = useState('');

  const setItemQty = itemId =>
    inventory.inventoryQuantityList.find(pc => pc.id === itemId);
  const isAlreadyScaned = id =>
    inventory.inventoryScanList.find(item => item._id === id);
  const itemsInventoried =
    inventory.inventoryScanList.length > 0
      ? `(${inventory.inventoryScanList.length})`
      : '';
  useEffect(() => {
    if (scan.scanInfoError !== 'InRepair' && scan.scanInfoError !== 'IsBan') {
      setError(getInventoryMesageError(scan.scanInfoError, scan.currentScan));
    }

    let isDuplicate = false;
    isDuplicate = isAlreadyScaned(scan.selectGiveId);
    if (isDuplicate) {
      setError(getInventoryMesageError('Duplicate', scan.currentScan));
    }

    if (
      !isAlreadyScaned(scan.selectGiveId) &&
      scan.scanInfoError !== 'NotFound' &&
      Object.keys(scan.scanInfo).length > 0
    ) {
      dispatch(alreadyScanned([...inventory.inventoryScanList, scan.scanInfo]));
    }
  }, [scan.scanGiveList, scan.scanInfoError]);

  const findInventoryItem = () => {
    navigation.navigate(settings.startPageInventory);
    dispatch(allowNewScan(true));
  };
  const inventoryItemsDetails = inventory.inventoryScanList.map(item => ({
    brand: item.metadata.brand,
    model: item.metadata.model,
    serial: item.metadata.serial,
    type: item.metadata.type,
  }));
  const inventorsItemIdAndQty = inventory.inventoryScanList
    .filter(
      item => !inventory.inventoryQuantityList.find(pc => pc.id === item._id),
    )
    .map(item => ({id: item._id, quantity: item.batch.quantity}));

  const handleEndInventory = () => {
    navigation.navigate('Home');
    dispatch(clearGiveList());
    dispatch(allowNewScan(true));
    dispatch(loader(true));
    dispatch(
      makeStocktaking(
        inventory.currentInventoryUser,
        [...inventory.inventoryQuantityList, ...inventorsItemIdAndQty],
        inventoryItemsDetails,
        navigation,
      ),
    );
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
      />

      <ScrollView contentContainerStyle={styles.cards}>
        {inventory.inventoryScanList.length > 0 &&
          inventory.inventoryScanList.map(item => (
            <Card style={styles.card} key={item._id}>
              <ItemListCard item={item} isPriceShown={false} />
              <View style={styles.setQtyBtn}>
                {+item.batch.quantity !== 1 && !setItemQty(item._id) && (
                  <DarkButton
                    onPress={() =>
                      handleNavigateToSingleItemPage(
                        item.code,
                        navigation,
                        item._id,
                        'SetInventoryQty',
                        dispatch,
                      )
                    }
                    text={T.t('set_quantity')}
                  />
                )}
              </View>
              {setItemQty(item._id) && (
                <Card.Content style={styles.editArea}>
                  <Text style={styles.cardTitle}>
                    {T.t('current_inventori_qty')}:{' '}
                    {setItemQty(item._id).quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      handleNavigateToSingleItemPage(
                        item.code,
                        navigation,
                        item._id,
                        'SetInventoryQty',
                        dispatch,
                      )
                    }>
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
          onPress={() => {}}
          text={`${T.t('create')} ${T.t('qr_code')}`}
        />
        <DarkButton
          onPress={handleEndInventory}
          disabled={inventory.inventoryScanList.length === 0}
          text={`${T.t('finish_inventory')}${itemsInventoried}`}
        />
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
  cards: {
    marginTop: -10,
    paddingTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: Dimensions.get('window').height - 100,
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
