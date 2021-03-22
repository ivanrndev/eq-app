import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {Card, Paragraph, Searchbar} from 'react-native-paper';
import T from '../../i18n';
import {getSearchItem, loader, searchMyItem} from '../../actions/actions';
import {actionCheckError} from '../../utils/helpers';
import ItemListCard from '../ItemListCard';

const Search = ({isSearchForGiveItem, pageToChosenItem, setIsSearchOpen}) => {
  const dispatch = useDispatch();
  const [onMe, itemsLimit] = useSelector(({onMe, auth}) => [
    onMe,
    auth.currentCompany.itemsLimit,
  ]);
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [searchList, setSearchList] = useState([]);
  const showEmptyError = !onMe.myList.length && search.length !== 0;

  useEffect(
    () =>
      search.length === 0 ? setSearchList([]) : setSearchList(onMe.myList),
    [search],
  );

  const handleItemSearch = query => {
    setSearch(query);
    dispatch(searchMyItem(query, 0, true, itemsLimit));
  };

  const handleCurrentScan = item => {
    actionCheckError(item);
    dispatch(loader(true));
    dispatch(getSearchItem(item._id, isSearchForGiveItem));
    navigation.navigate(pageToChosenItem);
    setIsSearchOpen(false);
    setSearch('');
  };
  const renderItem = ({item}) => (
    <Card style={styles.card} onPress={() => handleCurrentScan(item)}>
      <ItemListCard item={item} />
    </Card>
  );

  return (
    <View style={styles.body}>
      <Searchbar
        placeholder={T.t('search')}
        onChangeText={query => handleItemSearch(query)}
        value={search}
        style={styles.search}
      />

      <View>
        {showEmptyError && (
          <Paragraph style={styles.text}>{T.t('error_not_found')}</Paragraph>
        )}
        <FlatList
          renderItem={item => renderItem(item)}
          data={searchList}
          keyExtractor={item => item._id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    zIndex: 1,
    marginTop: -10,
    display: 'flex',
    paddingTop: 30,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height,
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
    width: Dimensions.get('window').width / 1.3,
  },
});

export default Search;
