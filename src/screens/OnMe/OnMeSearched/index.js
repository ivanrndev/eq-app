import React, {useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity
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
import {
  getProperErrorMessage,
  handleNavigateToMySingleItem,
} from '../../../utils/helpers.js';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {myloadMore, searchMyItem} from '../../../actions/actions.js';
import ItemListCard from '../../../components/ItemListCard';
import {getSearchItems, searchItems} from "../../../actions/actions";
import Text from "react-native-paper/src/components/Typography/Text";

const OnMeSearched = props => {

  const [offset, setOffset] = useState(10)
  const dispatch = useDispatch();
  const [onMe, searchResult, searchCount] = useSelector(
      ({onMe}) => [onMe, onMe.searchResult, onMe.searchCount],
  );
  let error = getProperErrorMessage(onMe.markingError);
  let showEmptyError = !onMe.myList.length;

  const getMoreItems = () => {
    dispatch(myloadMore(true));
    dispatch(searchMyItem('', offset));
  };

  const changeOffset = () => {
    if (searchCount > offSet) {
      setOffset(offSet + 10)
    } else {
      setOffset(searchCount)
    }
  }

  const getMoreSearchItems = () => {
    dispatch(getSearchItems(props.queryText, offSet, 10));
    changeOffset();
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
          <View style={styles.container}>
            {!error && (
              <>
                <View style={styles.container}>
                  <ScrollView bounces={false} style={{ marginTop: 15, borderRadius: 15 }} showsVerticalScrollIndicator={false}>
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
                      {!error && onMe.myList.map((item, index, arr) => (
                          <TouchableOpacity
                            style={styles.card}
                            key={item._id}
                            onPress={() => handleItemPress(item)}>
                            <ItemListCard item={item}/>
                            <View style={{ height: 1, backgroundColor: '#D3E3F2', width: '90%', marginLeft: '5%', marginTop: 10}} />
                          </TouchableOpacity>
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
                      {(!onMe.myloadMore && (onMe.myList.length < onMe.totalItemsCount)) &&(
                        <Button
                          style={{ paddingBottom: 10 }}
                          mode="Text"
                          color="#22215B"
                          onPress={()=> {
                            setOffset(offSet+10)
                            getMoreItems();
                          }}>
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
      </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: Dimensions.get('window').height,
    backgroundColor: '#D3E3F2',
    alignItems: 'center'

  },
  search: {
    backgroundColor: '#EDF6FF',
    width: Dimensions.get('window').width / 1.1,
    // marginBottom: 20,
  },
  load: {
    marginTop: 10,
  },
  card: {
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    // borderBottomColor: 'gray',
    // borderBottomWidth: 0.5,
    backgroundColor: '#EDF6FF',
    color: '#22215B',
  },
  cards: {
    marginTop: -10,
    paddingTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

});

export default OnMeSearched;
