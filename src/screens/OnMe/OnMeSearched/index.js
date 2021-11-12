import React, {useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList
} from 'react-native';
import {
  ActivityIndicator,
  Button,
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
import {getSearchItems, searchItem} from "../../../actions/actions";
import Text from "react-native-paper/src/components/Typography/Text";
import {useDebouncedCallback} from "use-debounce";
import {SET_FILTERS} from "../../../actions/actionsType";

const OnMeSearched = props => {

  const [offset, setOffset] = useState(10)
  const dispatch = useDispatch();
  const [
     onMe,
     myList,
     searchCount,
     ] = useSelector(
       ({onMe, filterReducer}) => [
         onMe,
         onMe.myList,
         onMe.totalItemsCount,
       ],
  );

  const [
    query,
    responsibleUser,
    selectedLoc,
    selectedObj,
    type,
    status] = useSelector(
      ({onMe, filterReducer}) => [
        filterReducer.query,
        filterReducer.responsibleUser,
        filterReducer.selectedLoc,
        filterReducer.selectedObj,
        filterReducer.type,
        filterReducer.status,
      ],
  );
  React.useEffect(()=>{
    dispatch(searchItem(true, {
      query,
      responsibleUser,
      selectedLoc,
      selectedObj,
      type,
      status
    }, 0, true));
    setOffset(10);
  },[ query,
    responsibleUser,
    selectedLoc,
    selectedObj,
    type,
    status])

  let error = getProperErrorMessage(onMe.markingError);
  let showEmptyError = !onMe.myList?.length;


  const getMoreItems = () => {
    dispatch(myloadMore(true));
    // dispatch(searchMyItem('', offset));
    dispatch(searchMyItem({
      query,
      responsibleUser,
      selectedLoc,
      selectedObj,
      type,
      status
    }, offset));
  };

  const changeOffset = () => {
    if (searchCount > offset ) {
      setOffset(offset + 10)
    } else {
      setOffset(searchCount)
    }
  }

  const getMoreSearchItems = () => {
    // dispatch(getSearchItems(props.queryText, offset, 10));
    dispatch(getSearchItems({
      query,
      responsibleUser,
      selectedLoc,
      selectedObj,
      type,
      status
    }, offset, 10));
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
  const deleteFilter = (filter) =>{
    dispatch({
      type: SET_FILTERS,
      payload: filter,
    })
    // dispatch(clearOneFilter(filter));
  }

  const debouncedItemSearch = useDebouncedCallback(getMoreSearchItems, 500);
  const renderItem =({item, index})=>{
    let clearedItem = {}
    if(index===0) clearedItem={responsibleUser: {title: '', id:''}};
    if(index===1) clearedItem={selectedLoc:""};
    if(index===2) clearedItem={selectedObj:""};
    if(index===3) clearedItem={type:""};
    if(index===4) clearedItem={status:""};
    return <>
      {!!item &&
      <View style={{margin: 10, borderRadius:10, height:25,flexDirection: 'row', backgroundColor: '#EDF6FF', alignItems:'center'}}>
        <Text style={{padding:5}}>{item}</Text>
        <Text onPress={()=> {
          deleteFilter(clearedItem);
        }} style={{marginLeft: 5, padding:5, }}>x</Text>
      </View>
      }
    </>
  }
  const shownFilters = [

    responsibleUser ? responsibleUser.title:responsibleUser,
    selectedLoc ? selectedLoc.name : selectedLoc,
    selectedObj ? selectedObj.name : selectedObj,
    type,
    status ? status.title : status,

  ];
  return (
      <>
          <View style={styles.container}>
            {!error && (
              <>
                <View style={styles.container}>
                  <FlatList
                      numColumns={2}
                      data={shownFilters}
                      renderItem={renderItem}
                      keyExtractor={item => item}
                  />
                  <ScrollView bounces={false} style={{ marginTop: 15, borderRadius: 15 }} showsVerticalScrollIndicator={false}>
                    {!myList?.length &&
                    <View>
                      <Text style={{fontSize:20}}>
                        {T.t('your_list_empty')}
                      </Text>
                    </View>
                    }
                    {!!myList?.length && (
                      <>
                        {
                          showEmptyError && (
                            <Paragraph style={styles.text}>
                              {T.t('who_i_info')}
                            </Paragraph>
                          )}
                          {!error && myList.map((item, index, arr) => (
                              <TouchableOpacity
                                style={styles.card}
                                key={item._id}
                                onPress={() => handleItemPress(item)}>
                                <ItemListCard item={item}/>
                                <View style={{ height: 1, backgroundColor: '#D3E3F2', width: '90%', marginLeft: '5%', marginTop: 10}} />
                              </TouchableOpacity>
                            ))}

                        </>
                    )}
                  </ScrollView>
                  {props.queryText.length
                    ? myList?.length && myList?.length > 4
                      ? (<Button
                        style={styles.button}
                        mode="Text"
                        color="#22215B"
                        onPress={debouncedItemSearch}>
                        {offset < searchCount ? T.t('load_more') : (null)}
                      </Button>)
                      : null
                    : <>
                        {
                          onMe.myList?.length > 5 && (
                            <>
                              {(!onMe.myloadMore && (onMe.myList?.length < onMe.totalItemsCount)) &&(
                                <Button
                                  style={{ paddingBottom: 10 }}
                                  mode="Text"
                                  color="#22215B"
                                  onPress={()=> {
                                    setOffset(offset + 10)
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
                          )
                        }
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
    backgroundColor: '#D3E3F2',
    alignItems: 'center'

  },
  search: {
    backgroundColor: '#EDF6FF',
    width: Dimensions.get('window').width / 1.1,
  },
  load: {
    marginTop: 10,
  },
  card: {
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
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
