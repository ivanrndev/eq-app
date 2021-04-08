import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Card, Paragraph, Searchbar} from 'react-native-paper';
import T from '../../i18n';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {useNavigation} from '@react-navigation/native';
import ItemListCard from '../ItemListCard';
import {actionCheckError} from '../../utils/helpers';
import {
  getSearchItem,
  loader,
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
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [transfersList, transferId] = useSelector(({transfers}) => [
    transfers.transferList,
    transfers.transferId,
  ]);

  const [search, setSearch] = useState('');
  const showEmptyError = !list.length && search.length !== 0;
  const renderedList = search.length === 0 ? [] : list;
  const transferredItems = transfersList.find(item => item._id === transferId);
  const handleItemSearch = query => {
    setSearch(query.trim());
    dispatch(myloadMore(true));
    dispatch(listAction(query, 0, true));
  };

  const handleCurrentScan = item => {
    actionCheckError(item);
    dispatch(loader(true));
    dispatch(
      getSearchItem(
        item._id,
        navigation,
        pageToChosenItem,
        isSearchForGiveItem,
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
      <KeyboardAwareScrollView style={styles.container}>
        {showEmptyError && (
          <Paragraph style={styles.text}>{T.t('error_not_found')}</Paragraph>
        )}
        {renderedList.map(item => (
          <Card
            style={styles.card}
            onPress={() => handleCurrentScan(item)}
            key={item._id}>
            <ItemListCard item={item} />
          </Card>
        ))}
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    zIndex: 1,
    display: 'flex',
    paddingTop: 30,
    paddingBottom: 30,
    alignItems: 'center',
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height,
  },
  container: {
    flex: 1,
  },
  wrap: {
    marginBottom: 100,
  },
  search: {
    backgroundColor: '#EDF6FF',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 20,
  },
  card: {
    display: 'flex',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 15,
    backgroundColor: '#EDF6FF',
  },
  text: {
    fontSize: 15,
    paddingBottom: 5,
    color: '#7A7A9D',
    width: Dimensions.get('window').width / 1.1,
  },
});

export default Search;
