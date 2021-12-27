import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Dimensions, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Paragraph, Searchbar} from 'react-native-paper';
import T from '../../i18n';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {useNavigation} from '@react-navigation/native';
import ItemListCard from '../ItemListCard';
import {actionCheckError, handleNavigateToSingleItemPage} from '../../utils/helpers';
import {
  addItemInInventory,
  getSearchItem,
  loader,
  makeInventory,
  myloadMore,
  updateTransfer,
} from '../../actions/actions';

const Search = ({
  list,
  listAction,
  pageToChosenItem,
  setIsSearchOpen,
  isSearchForGiveItem,
  onSelectAction,
  editTransfer,
  isSearchForMoveItem,
  filter,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [transfersList, transferId, inventoryId, currentInventoryUser] = useSelector(
    ({transfers, inventory}) => [
      transfers.transferList,
      transfers.transferId,
      inventory.inventoryId,
      inventory.currentInventoryUser,
    ],
  );

  const [search, setSearch] = useState('');
  const showEmptyError = !list.length && search.length !== 0;
  const renderedList = list;
  // const renderedList = search.length === 0 ? [] : list;
  const transferredItems = transfersList.find(item => item._id === transferId);
  const handleItemSearch = query => {
    setSearch(query.trim());
    dispatch(myloadMore(true));
    dispatch(listAction(query, 0, 50));
  };

  useEffect(() => {
    dispatch(myloadMore(true));
    dispatch(listAction('', 0, true));
  }, []);

  const handleCurrentScan = item => {
    const normalizedItem = [
      {
        id: item._id,
        quantity: item?.batch?.quantity || '1',
      },
    ];
    // if (pageToChosenItem === 'InventoryChooseMode') {
    if (inventoryId) {
      // item?.batch?.quantity
      //   ? handleNavigateToSingleItemPage(
      //       item.code,
      //       navigation,
      //       item._id,
      //       'SetInventoryQty',
      //       dispatch,
      //       inventoryId,
      //     )
      //   :
      dispatch(addItemInInventory(inventoryId, normalizedItem));
    } else {
      // item?.batch?.quantity
      //   ? handleNavigateToSingleItemPage(
      //       item.code,
      //       navigation,
      //       item._id,
      //       'SetInventoryQty',
      //       dispatch,
      //       inventoryId,
      //     )
      //   :
      dispatch(makeInventory(currentInventoryUser, normalizedItem));
    }
    // }
    actionCheckError(item);
    dispatch(loader(true));
    dispatch(
      getSearchItem(
        item._id,
        navigation,
        // pageToChosenItem === 'InventoryChooseMode' && item?.batch?.quantity
        //   ? 'SetInventoryQty'
        //   : pageToChosenItem,
        pageToChosenItem,
        isSearchForGiveItem,
        isSearchForMoveItem,
        filter,
      ),
      !!onSelectAction && dispatch(onSelectAction(item)),
      editTransfer &&
        dispatch(
          updateTransfer(
            navigation,
            transferId,
            [...transferredItems.items, item],
            'TransfersEdit',
          ),
        ),
    );
    setIsSearchOpen(false);
    setSearch('');
  };

  return (
    <View style={styles.body}>
      <Searchbar
        placeholder={T.t('search')}
        onChangeText={val => handleItemSearch(val)}
        value={search}
        style={styles.search}
      />
      <View style={styles.container}>
        <KeyboardAwareScrollView style={{borderRadius: 15}}>
          {showEmptyError && <Paragraph style={styles.text}>{T.t('error_not_found')}</Paragraph>}
          {renderedList.map(item => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                handleCurrentScan(item);
              }}
              key={item._id}>
              <ItemListCard
                item={item}
                isResponsibleShown={
                  pageToChosenItem === 'GiveListCheck' ||
                  pageToChosenItem === 'WriteOffInfo' ||
                  pageToChosenItem === 'IdentInfo'
                }
              />
              <View
                style={{
                  height: 1,
                  backgroundColor: '#D3E3F2',
                  width: '90%',
                  marginLeft: '5%',
                  marginTop: 10,
                }}
              />
            </TouchableOpacity>
          ))}
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    paddingTop: 30,
    paddingBottom: 30,
    alignItems: 'center',
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height,
  },
  container: {
    flex: 1,
    marginBottom: 100,
  },
  search: {
    backgroundColor: '#EDF6FF',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 20,
  },

  card: {
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    backgroundColor: '#EDF6FF',
    color: '#22215B',
  },
  text: {
    fontSize: 15,
    paddingBottom: 5,
    color: '#7A7A9D',
    width: Dimensions.get('window').width / 1.1,
  },
});

export default Search;
