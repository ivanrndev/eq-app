import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  SafeAreaView,
  FlatList, Image
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Searchbar,
} from 'react-native-paper';
import T from '../../../i18n';
// components
import Appbar from '../../../components/Appbar';
import {
  handleNavigateToMySingleItem,
} from '../../../utils/helpers.js';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {myloadMore} from '../../../actions/actions.js';
import ItemListCard from '../../../components/ItemListCard';
import {searchItem, setIsShowFilter} from "../../../actions/actions";
import {getTypes} from "../../../actions/createItem";
import {AutocompleteDropdown} from "react-native-autocomplete-dropdown";
import {width} from "../../../constants/dimentionsAndUnits";
import {useNavigation} from "@react-navigation/native";

const OnMeSearch = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [marking, users, objects, types, responsible, location, isShowFilter] = useSelector(
    ({marking, give, settings, createItem, onMe}) => [
      marking,
      give.userList,
      settings.locations ? settings.locations : [],
      createItem.types,
      createItem.responsible,
      createItem.location,
        onMe.isShowFilter
    ],
  );

  const [isFilters, setIsFilters] = useState(false);
  const [endFilters, setEndFilters] = useState(false)
  const [query, setQuery] = useState('');
  const [searchBar, setSearchBar] = useState(true);
  const [type, setType] = useState(types);
  const [status, setStatus] = useState('');
  const [responsibleUser, setResponsibleUser] = useState({title: ''});
  const [selectedLoc, setSelectedLoc] = useState('');
  const [selectedLocObj, setSelectedLocObj] = useState('');
  const [selectedObj, setSelectedObj] = useState('');
  const [selectedObjObj, setSelectedObjObj] = useState([]);

  useEffect(() => {
    dispatch(getTypes(type));
  }, [type]);

  const clearInputs =() => {
    setQuery("");
    setStatus("");
    setType(types);
    setResponsibleUser("");
    setSelectedLoc("");
    setSelectedObj("");

  }
  const animate = (boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    setSearchBar(boolean);
  };

  const itemSearch = text => {
    setQuery(text);
  };

  const getMoreItems = () => {
    dispatch(myloadMore(true));
    dispatch(searchItem(true, '', 6, true));
  };

  const handleItemPress = item => {

    handleNavigateToMySingleItem(
      item.code,
      navigation,
      item._id,
      'OnMeInfo',
      dispatch,
    );
  };

  const getSearchItems = () => {
    dispatch(searchItem(true, {
      query,
      responsibleUser,
      selectedLoc,
      selectedObj,
      type,
      status
    }, 0, true));
    animate(false);
    responsibleUser && (responsibleUser.title && setIsFilters(true));

  }
  // const closeFilters = () => {
  //   getSearchItems();
  //   setIsFilters(false)
  // }
  const handleTypeField = text => {
    setType(text);
  };

  const handleStatus = item => {
    setStatus(item);
  };

  const handleSelectObj = item => {
    setSelectedLoc(item);
    setSelectedLoc({name: item ? item.title : ''});
    if (!!item) {
      const selectedObj =
        objects.length > 0 ? objects.find(obj => obj._id === item.id) : [];
      setSelectedLocObj(selectedObj);
      !!selectedObj && setSelectedObjObj(selectedObj.locations);
    }
  };

  const objectLoc = selectedObjObj.length
    ? selectedObjObj.map(item => ({
      name: item,
      id: Math.floor(Math.random() * 1000),
    }))
    : [];

  const handleSelectTextChange = text => {
    setResponsibleUser({title: text});
  };

  const handleSelectResp = item => {
    setResponsibleUser(item);
  };

  return (
    <SafeAreaView style={{flex: 1}}>

      <View style={styles.body}>
          <>
            {(!searchBar && isFilters) &&
            <View style={{margin: 20, flexDirection: 'row'}}>
              <TouchableOpacity style={{flexDirection: 'row', backgroundColor:'white', height:20, borderRadius:5}}>

                <Text
                    style={{fontSize:14, marginRight: 10}}
                    onPress={()=> {
                      animate(true);
                      setIsFilters(false);
                    }}
                >

                  {responsibleUser && responsibleUser.title}
                </Text>
                <Text
                    style={{fontSize:14}}
                    onPress={()=> {
                      getSearchItems();
                      clearInputs()
                      setIsFilters(false);
                    }}
                >
                  X
                </Text>
              </TouchableOpacity>
            </View>
            }
              {(searchBar  || isShowFilter) && (

              <View style={styles.searchBar}>
                <ScrollView >
                <View style={styles.inputWrap}>
                  {/*<Searchbar*/}
                  {/*  placeholder={T.t('search')}*/}
                  {/*  onChangeText={text => itemSearch(text)}*/}
                  {/*  value={query}*/}
                  {/*  style={styles.search}/>*/}
                  <Text style={styles.left}>{T.t('responsible')}:</Text>
                  <AutocompleteDropdown
                    clearOnFocus={true}
                    closeOnBlur={true}
                    closeOnSubmit={true}
                    showClear={true}
                    onChangeText={text => handleSelectTextChange({title: text})}
                    onSelectItem={item => item && handleSelectResp(item)}
                    onClear={() => handleSelectResp(null)}
                    dataSet={() =>
                      users.map(item => ({
                        title: item.firstName,
                        id: item._id,
                      }))
                    }
                    textInputProps={{
                      placeholder: T.t('choose_user'),
                      autoCorrect: false,
                      autoCapitalize: 'none',
                      style: styles.inputDropdown,
                      placeholderTextColor: 'gray',
                      defaultValue: responsibleUser?.title,
                      value: responsibleUser?.title,
                    }}
                    rightButtonsContainerStyle={styles.inputBtn}
                    suggestionsListContainerStyle={styles.dropdown}
                  />
                  <Text style={styles.left}>{T.t('object')}:</Text>
                  <AutocompleteDropdown
                    clearOnFocus={true}
                    closeOnBlur={true}
                    closeOnSubmit={true}
                    showClear={true}
                    onChangeText={text => setSelectedLoc({name: text})}
                    onSelectItem={item => item && handleSelectObj(item)}
                    onClear={() => handleSelectObj(null)}
                    dataSet={() =>
                      objects.length
                        ? objects.map(item => ({
                          title: item ? item.title : '',
                          id: item ? item._id : '',
                        }))
                        : []
                    }
                    textInputProps={{
                      placeholder: T.t('choose_object'),
                      autoCorrect: false,
                      autoCapitalize: 'none',
                      style: styles.inputDropdown,
                      placeholderTextColor: 'gray',
                      defaultValue: location.location,
                      value: selectedLoc?.name
                    }}
                    rightButtonsContainerStyle={styles.inputBtn}
                    suggestionsListContainerStyle={styles.dropdown}
                  />
                  <Text style={styles.left}>{T.t('location')}:</Text>
                  <AutocompleteDropdown
                    clearOnFocus={true}
                    closeOnBlur={true}
                    closeOnSubmit={true}
                    showClear={true}
                    onChangeText={text => setSelectedObj({name: text})}
                    onSelectItem={item => item && setSelectedObj({name: item ? item.title : ''})}
                    onClear={() => setSelectedObj(null)}
                    dataSet={() =>
                      objects.length
                        ? objectLoc.map(item => ({
                          title: item ? item.name : '',
                          id: item ? item._id : '',
                        }))
                        : []
                    }
                    textInputProps={{
                      placeholder: T.t('choose_location'),
                      autoCorrect: false,
                      autoCapitalize: 'none',
                      style: styles.inputDropdown,
                      placeholderTextColor: 'gray',
                      defaultValue: location.object,
                      value: selectedObj?.name
                    }}
                    rightButtonsContainerStyle={styles.inputBtn}
                    suggestionsListContainerStyle={styles.dropdown}
                  />
                  <Text style={styles.left}>{T.t('detail_type')}:</Text>
                  <AutocompleteDropdown
                    clearOnFocus={true}
                    closeOnBlur={true}
                    closeOnSubmit={true}
                    showClear={true}
                    onChangeText={handleTypeField}
                    onSelectItem={text => text && handleTypeField(text ? text.title : '')}
                    onClear={() => handleTypeField(null)}
                    dataSet={() =>
                      types.map(type => ({id: type._id, title: type.title}))
                    }
                    textInputProps={{
                      placeholder: `${T.t('detail_type')}*`,
                      autoCorrect: false,
                      autoCapitalize: 'none',
                      style: styles.inputDropdown,
                      placeholderTextColor: 'gray',
                      value: type,
                    }}
                    rightButtonsContainerStyle={styles.inputBtn}
                    suggestionsListContainerStyle={styles.dropdown}
                  />
                  <Text style={styles.left}>{T.t('transfer_status')}:</Text>
                  <AutocompleteDropdown
                    clearOnFocus={true}
                    closeOnBlur={true}
                    closeOnSubmit={true}
                    showClear={true}
                    onChangeText={handleStatus}
                    onSelectItem={item => item && handleStatus(item)}
                    onClear={() => handleStatus(null)}
                    dataSet={[
                      { value: 'ban', title: `${T.t('operation_ban')}` },
                      { value: 'repair', title: `${T.t('error_services')}` },
                    ]}
                    textInputProps={{
                      placeholder: `${T.t('transfer_status')}*`,
                      autoCorrect: false,
                      autoCapitalize: 'none',
                      style: styles.inputDropdown,
                      placeholderTextColor: 'gray',
                      value: status?.title,
                    }}
                    rightButtonsContainerStyle={styles.inputBtn}
                    suggestionsListContainerStyle={styles.dropdown}
                  />
                  <View style={{flexDirection:'row'}}>
                    <Button
                        style={styles.button}
                        mode="Text"
                        color="#22215B"
                        onPress={()=> {
                          clearInputs();
                        }}>
                      {T.t('clear')}
                    </Button>
                    <Button
                        style={styles.button}
                        mode="Text"
                        color="#22215B"
                        onPress={()=> {
                          getSearchItems();
                          // setIsFilters(true);
                          dispatch(setIsShowFilter(false));
                        }}>
                      {T.t('search')}
                    </Button>
                  </View>
                </View>
                </ScrollView>
              </View>
            )}
          </>

        <View style={styles.container}>
            <>
              <View style={styles.container}>
                <ScrollView>
                  {marking.markingList.map(item => (
                    <Card
                      style={styles.card}
                      key={item._id}
                      onPress={() => handleItemPress(item)}>
                      <ItemListCard item={item}/>
                    </Card>
                  ))}
                </ScrollView>
                {marking.markingList.length > 5 && (
                  <>
                    {marking.markingList && (
                      <Button
                        style={styles.button}
                        mode="Text"
                        color="#22215B"
                        onPress={getMoreItems}>
                        {T.t('load_more')}
                      </Button>
                    )}
                    {!marking.markingList && (
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
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    marginTop: -10,
    display: 'flex',
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
  left: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
    width: width / 1.1,
  },
  inputWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    marginVertical: 30,
    minHeight: 200,
  },
  tinyLogo: {
    width: 50,
    height: 50,

  },
  textInput: {
    padding: 12,
    borderColor: '#22215B',
    borderWidth: 1,
    borderRadius: 5,
  },
  inputDropdown: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: Dimensions.get('window').width / 1.1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#929394',
    height: 55,
    borderRadius: 5,
    padding: 15,
  },
  inputBtn: {
    right: 10,
    height: 55,
    top: 10,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  dropdown: {
    top: 0,
    width: Dimensions.get('window').width / 1.1,
    alignSelf: 'center',
    backgroundColor: '#C5CDD5',
    position: 'relative',
    zIndex: 2,
  },
  searchBar: {
  height: '90%',
  zIndex: 3,
  backgroundColor: '#D3E3F2',
  position: 'absolute',
  top: 20,
}
});

export default OnMeSearch;
