import React, {useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Paragraph,
  Searchbar,
  Title,
} from 'react-native-paper';
import T from '../../i18n';
// components
import Appbar from '../../components/Appbar';
import {
  getProperErrorMessage,
  handleNavigateToMySingleItem,
} from '../../utils/helpers.js';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {myloadMore, searchMyItem} from '../../actions/actions.js';
import ItemListCard from '../../components/ItemListCard';

const OnMe = props => {
  const dispatch = useDispatch();
  const onMe = useSelector(state => state.onMe);
  const [search, setSearch] = useState('');
  let error = getProperErrorMessage(onMe.markingError);
  let showEmptyError = !onMe.myList.length;

  const itemSearch = query => {
    setSearch(query);
    dispatch(myloadMore(true));
    dispatch(searchMyItem(query, 0, true));
  };

  const getMoreItems = () => {
    dispatch(myloadMore(true));
    dispatch(searchMyItem(search, onMe.offSet, false, 6));
  };

  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        newScan={true}
        goTo={'Home'}
        title={T.t('who_i')}
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
        <View style={styles.container}>
          {!error && (
            <>
              <View style={styles.container}>
                <ScrollView>
                  {showEmptyError && (
                    <Paragraph style={styles.text}>
                      {T.t('who_i_info')}
                    </Paragraph>
                  )}
                  {!error
                    ? onMe.myList.map(item => (
                        <Card
                          style={styles.card}
                          key={item._id}
                          onPress={() =>
                            handleNavigateToMySingleItem(
                              item.code,
                              props.navigation,
                              item._id,
                              'OnMeInfo',
                              dispatch,
                            )
                          }>
                          <ItemListCard item={item} />
                        </Card>
                      ))
                    : null}
                </ScrollView>
                {onMe.myList.length > 5 && (
                  <>
                    {!onMe.myloadMore && (
                      <Button
                        style={styles.button}
                        mode="Text"
                        color="#22215B"
                        onPress={getMoreItems}>
                        {T.t('load_more')}
                      </Button>
                    )}
                    {onMe.myloadMore && (
                      <ActivityIndicator
                        style={styles.load}
                        size={'large'}
                        animating={true}
                        color={'#EDF6FF'}
                      />
                    )}
                  </>
                )}
              </View>
            </>
          )}
          {error ? <Title style={styles.title}>{error}</Title> : null}
        </View>
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

  text: {
    fontSize: 15,
    textAlign: 'center',
    paddingBottom: 20,
    width: Dimensions.get('window').width / 1.2,
  },
});

export default OnMe;
