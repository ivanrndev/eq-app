import React, {useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';
import {ActivityIndicator, Button, Card, Paragraph, Searchbar, Title} from 'react-native-paper';
import T from '../../../i18n';
// components
import Appbar from '../../../components/Appbar';
import {getProperErrorMessage} from '../../../utils/helpers.js';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {loadMore, saveCurrentItemMark} from '../../../actions/actions.js';
import ItemListCard from '../../../components/ItemListCard';
import {searchMarkedItems} from '../../../actions/actions';
import {CardList} from '../../../components/ItemCardList/cardList';

const MarkingList = props => {
  const dispatch = useDispatch();
  const [marking, settings] = useSelector(({marking, settings}) => [marking, settings]);
  let error = getProperErrorMessage(marking.markingError);
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(10);

  const itemSearch = query => {
    setSearch(query);
    dispatch(loadMore(true));
    dispatch(searchMarkedItems(marking.marking, query, 0, false));
    setOffset(10);
  };

  const getMoreItems = () => {
    changeOffset();
    dispatch(loadMore(true));
    dispatch(searchMarkedItems(marking.marking, search, offset, true));
  };

  const changeOffset = () => {
    if (marking.searchCount > offset) {
      setOffset(offset + 10);
    } else {
      setOffset(marking.searchCount);
    }
  };

  let showEmptyError = false;
  if (!marking.marking && marking.markingList.length === 0) {
    showEmptyError = true;
  }

  const saveCurrentItem = (_id, navigation, settings) => {
    dispatch(saveCurrentItemMark(_id, navigation, settings));
  };

  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        newScan={true}
        goTo={'Marking'}
        title={marking.marking ? T.t('title_remark') : T.t('title_mark')}
      />
      <SafeAreaView />
      <View style={styles.body}>
        {!error && (
          <Searchbar
            placeholder={T.t('search')}
            onChangeText={query => itemSearch(query)}
            value={search}
            style={styles.search}
          />
        )}
        {!error && (
          <>
            <View style={styles.container}>
              {/*<CardList*/}
              {/*  showEmptyError={showEmptyError}*/}
              {/*  data={marking.markingList}*/}
              {/*  getMoreItems={getMoreItems}*/}
              {/*  navigation={props.navigation}*/}
              {/*  settings={settings}*/}
              {/*  loadMore={marking.loadMore}*/}
              {/*  saveCurrentItem={saveCurrentItem}*/}
              {/*/>*/}
              <ScrollView style={styles.scroll}>
                {showEmptyError && <Paragraph style={styles.text}>{T.t('no_available')}</Paragraph>}
                {!error &&
                  marking.markingList.map((item, index) => (
                    <Card
                      style={styles.card}
                      key={index}
                      onPress={() =>
                        dispatch(
                          saveCurrentItemMark(
                            item._id,
                            props.navigation,
                            settings.startPageMarking,
                          ),
                        )
                      }>
                      <ItemListCard item={item} isResponsibleShown={true} />
                    </Card>
                  ))}
              </ScrollView>
            </View>
            {marking.markingList.length > 5 && (
              <>
                {marking.searchCount >= offset ? (
                  <>
                    {!marking.loadMore && (
                      <Button
                        style={styles.button}
                        mode="Text"
                        color="#22215B"
                        onPress={getMoreItems}>
                        {T.t('load_more')}
                      </Button>
                    )}
                    {marking.loadMore && (
                      <ActivityIndicator
                        style={styles.load}
                        size={'large'}
                        animating={true}
                        color={'#EDF6FF'}
                      />
                    )}
                  </>
                ) : null}
              </>
            )}
          </>
        )}
        {error ? <Title style={styles.title}>{error}</Title> : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    marginTop: -10,
    display: 'flex',
    paddingTop: 25,
    alignItems: 'center',
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height,
  },
  container: {
    height: Dimensions.get('window').height / 1.5,
  },
  search: {
    backgroundColor: '#EDF6FF',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 20,
  },
  load: {
    marginTop: 10,
  },
  card: {
    display: 'flex',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 15,
    backgroundColor: '#EDF6FF',
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    paddingBottom: 20,
    width: Dimensions.get('window').width / 1.2,
  },
  scroll: {
    backgroundColor: '#D3E3F2',
  },
});

export default MarkingList;
