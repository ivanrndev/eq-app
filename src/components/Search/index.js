import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import {Card, Paragraph, Searchbar} from 'react-native-paper';
import T from '../../i18n';
import React, {useState} from 'react';
import ItemListCard from '../ItemListCard';
import {actionCheckError} from '../../utils/helpers';
import {getSearchItem, loader, myloadMore} from '../../actions/actions';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

const Search = ({
  list,
  listAction,
  pageToChosenItem,
  setIsSearchOpen,
  isSearchForGiveItem = true,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const showEmptyError = !list.length && search.length !== 0;

  const handleItemSearch = query => {
    setSearch(query);
    dispatch(myloadMore(true));
    dispatch(listAction(query, 0, true));
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
        onChangeText={val => handleItemSearch(val)}
        value={search}
        style={styles.search}
      />

      <View>
        {showEmptyError && (
          <Paragraph style={styles.text}>{T.t('error_not_found')}</Paragraph>
        )}
        <FlatList
          renderItem={item => renderItem(item)}
          data={list}
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
