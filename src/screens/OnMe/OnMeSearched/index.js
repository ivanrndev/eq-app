import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  SafeAreaView
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Paragraph,
  Title,
} from 'react-native-paper';
import T from '../../../i18n';
// components
import Appbar from '../../../components/Appbar';
import {
  getProperErrorMessage,
  handleNavigateToMySingleItem,
} from '../../../utils/helpers.js';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {myloadMore, searchMyItem} from '../../../actions/actions.js';
import ItemListCard from '../../../components/ItemListCard';
import {searchItems} from "../../../actions/actions";

const OnMeSearched = props => {

  const dispatch = useDispatch();
  const [onMe, searchResult] = useSelector(
      ({onMe}) => [onMe, onMe.searchResult],
  );
  let error = getProperErrorMessage(onMe.markingError);
  let showEmptyError = !onMe.myList.length;

  const getMoreItems = () => {
    dispatch(myloadMore(true));
    dispatch(searchMyItem('', onMe.offSet, false, 6));
  };

  const getMoreSearchItems = () => {
    dispatch(searchItems(props.queryText, 10, 10))
    console.log('для функции загрузить еще')
  };


  const handleItemPress = item => {

    handleNavigateToMySingleItem(
        item.code,
        props.navigation,
        item._id,
        'OnMeInfo',
        dispatch,
    );
  };

  return (
      <>
        <View style={styles.body}>
          <View style={styles.container}>
            {!error && (
              <>
                <View style={styles.container}>
                  <ScrollView>
                    {searchResult?.length ? (<>{searchResult.map(item => (
                      <Card
                        style={styles.card}
                        key={item._id}
                        onPress={() => handleItemPress(item)}>
                        <ItemListCard item={item}/>
                      </Card>
                    ))}</>) : (<>{showEmptyError && (
                      <Paragraph style={styles.text}>
                        {T.t('who_i_info')}
                      </Paragraph>
                    )}
                      {!error && onMe.myList.map(item => (
                          <Card
                            style={styles.card}
                            key={item._id}
                            onPress={() => handleItemPress(item)}>
                            <ItemListCard item={item}/>
                          </Card>
                        ))}
                        </>)}
                  </ScrollView>
                  {searchResult?.length ?
                    <Button
                      style={styles.button}
                      mode="Text"
                      color="#22215B"
                      onPress={getMoreSearchItems}>
                      {T.t('load_more')}
                    </Button> :
                    <>{onMe.myList.length > 5 && (
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
                    </>
                  }
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
    position:'absolute',
    zIndex:-10,
    width: Dimensions.get('window').width,
    marginTop: 100,
    paddingTop: 25,
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height,
  },
  container: {
    height: Dimensions.get('window').height / 1.4,
    alignItems: 'center',
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

export default OnMeSearched;
