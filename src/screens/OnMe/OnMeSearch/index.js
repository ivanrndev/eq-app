import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {
  Button,
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
import {getUserList, searchItem, searchMyCompanyItems, setIsShowFilter} from "../../../actions/actions";
import {getTypes} from "../../../actions/createItem";
import {AutocompleteDropdown} from "react-native-autocomplete-dropdown";
import {height, width} from "../../../constants/dimentionsAndUnits";
import {useNavigation} from "@react-navigation/native";
import {SET_FILTERS} from "../../../actions/actionsType";

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

  useEffect(() => {
    dispatch(getUserList(navigation, '', 'OnMeSearch'));
  }, []);
  const {
    storeQuery,
    storeResponsibleUser,
    storeSelectedLoc,
    storeSelectedObj,
    storeType,
    storeStatus,
  } = useSelector(state => ({
    storeQuery: state.filterReducer.query,
    storeResponsibleUser: state.filterReducer.responsibleUser,
    storeSelectedLoc: state.filterReducer.selectedLoc,
    storeSelectedObj: state.filterReducer.selectedObj,
    storeType: state.filterReducer.type,
    storeStatus: state.filterReducer.status,
  }))
  const [errors, setErrors] = useState(storeQuery);
  const [query, setQuery] = useState(storeQuery);
  const [type, setType] = useState(storeType);
  const [status, setStatus] = useState(storeStatus);
  const [responsibleUser, setResponsibleUser] = useState(storeResponsibleUser);
  const [selectedLoc, setSelectedLoc] = useState(storeSelectedLoc);
  const [selectedLocObj, setSelectedLocObj] = useState('');
  const [selectedObj, setSelectedObj] = useState(storeSelectedObj);
  const [selectedObjObj, setSelectedObjObj] = useState([]);
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [searchStatus, setSearchStatus] = useState(false);

  useEffect(() => {
    dispatch(getTypes(type));
  }, [type]);

  const clearInputs =() => {
    setQuery("");
    setStatus("");
    setType("");
    setResponsibleUser("");
    setSelectedLoc("");
    setSelectedObj("");
    dispatch({
      type: SET_FILTERS,
      payload: {
        responsibleUser: {title: ''},
        selectedLoc: '',
        selectedObj: '',
        type: '',
        status: '',
        query: ''
      },
    })
    props.navigation.goBack()
    // getSearchItems();
  }

  const getSearchItems = () => {

    dispatch(searchItem(true, {
      query,
      responsibleUser,
      selectedLoc,
      selectedObj,
      type,
      status
    }, 0, true));
    props.navigation.goBack()
  }
  const handleTypeField = text => {
    setType(text);
    !text ? setErrors(T.t('error_required')) : setErrors('');
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
    const selectedUser = users.find(user => user.firstName === text);
    // selectedUser
    //     ? seteErrorSelectedUser('')
    //     : seteErrorSelectedUser(T.t('error_user_not_exist'));
  };

  const handleSelectResp = item => {
    setResponsibleUser(item);
  };

  return (

      <View style={[styles.body,{paddingBottom: keyboardStatus || searchStatus ? 977 : 0} ]}>
      <Appbar
          navigation={props.navigation}
          pageToChosenItem="OnMeInfo"
          arrow={true}
          newScan={true}
          goTo={'back'}
          title={T.t('who_i')}
          onMe={true}
          cb={() => {
            setQuery(storeQuery);
            setStatus(storeStatus);
            setType(storeType);
            setResponsibleUser(storeResponsibleUser);
            setSelectedLoc(storeSelectedLoc);
            setSelectedObj(storeSelectedObj);
          }}
      />
          <>
              <View>
                <View style={styles.inputWrap}>
                  <Text style={styles.left}>{T.t('responsible')}:</Text>
                  <AutocompleteDropdown
                    clearOnFocus={true}
                    closeOnBlur={false}
                    closeOnSubmit={true}
                    showClear={true}
                    onChangeText={text => handleSelectTextChange(text)}
                    onSelectItem={item => item && handleSelectResp(item)}
                    onClear={() => handleSelectResp(null)}
                    onOpenSuggestionsList={(_) => console.log({_})}
                    dataSet={() =>
                      users.map(item => ({
                        title:  item.lastName ? `${item.firstName} ${item.lastName}` : item.firstName,
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
                    closeOnBlur={false}
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
                    closeOnBlur={false}
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
                    onOpenSuggestionsList={(res) => setSearchStatus(res)}
                    clearOnFocus={true}
                    closeOnBlur={false}
                    closeOnSubmit={true}
                    showClear={true}
                    onFocus={() => {setKeyboardStatus(!keyboardStatus)}}
                    onBlur={() => {setKeyboardStatus(!keyboardStatus)}}
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
                      defaultValue: type && type,
                      value: type && type,
                    }}
                    rightButtonsContainerStyle={styles.inputBtn}
                    suggestionsListContainerStyle={styles.dropdown}
                  />
                  <Text style={styles.left}>{T.t('transfer_status')}:</Text>
                  <AutocompleteDropdown
                    onOpenSuggestionsList={(res) => setSearchStatus(res)}
                    clearOnFocus={true}
                    closeOnBlur={false}
                    closeOnSubmit={true}
                    showClear={true}
                    onFocus={() => {setKeyboardStatus(!keyboardStatus)}}
                    onBlur={() => {setKeyboardStatus(!keyboardStatus)}}
                    onChangeText={handleStatus}

                    onSelectItem={item => item && handleStatus(item)}
                    onClear={() => handleStatus(null)}
                    dataSet={[
                      { value: 'ban', title: `${T.t('write_off')}` },
                      { value: 'repair', title: `${T.t('error_services')}` },
                      { value: 'worker', title: `${T.t('worker')}` },
                      { value: 'transfer', title: `${T.t('in_the_process_of_transmission')}` },
                      { value: 'default', title: `${T.t('no_allocated')}` }
                    ]}
                    textInputProps={{
                      placeholder: `${T.t('transfer_status')}*`,
                      autoCorrect: false,
                      autoCapitalize: 'none',
                      style: styles.inputDropdown,
                      placeholderTextColor: 'gray',
                      defaultValue: status?.title,
                      value: status?.title
                    }}
                    rightButtonsContainerStyle={styles.inputBtn}
                    suggestionsListContainerStyle={styles.dropdown}
                  />
                  <View style={{flexDirection:'row', paddingVertical: 10}}>
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
                        }}>
                      {T.t('search')}
                    </Button>
                  </View>
                </View>
              </View>
          </>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    marginTop: -10,
    backgroundColor: '#D3E3F2',
    flex: 1,
    justifyContent: 'flex-start',

  },
  container: {
    height: Dimensions.get('window').height / 1.1,
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
});

export default OnMeSearch;
