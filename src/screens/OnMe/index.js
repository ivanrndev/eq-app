import React, {useEffect, useState} from 'react';
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
import OnMeSearched from "./OnMeSearched";
import OnMeSearch from "./OnMeSearch";
import {searchMyCompanyItems} from "../../actions/actions";
import {useUserData} from "../../hooks/useUserData";

const OnMe = props => {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [onMe] = useSelector(
    ({onMe}) => [onMe],
  );
  const [companyItemList, currentInventoryUser] = useSelector(
      ({companyItems, inventory}) => [
        companyItems.myCompanyList,
        inventory.currentInventoryUser,
      ],
  );
  let error = getProperErrorMessage(onMe.markingError);
  let showEmptyError = !onMe.myList.length;
  const {role, userId} = useUserData();

  const getMoreItems = () => {
    dispatch(myloadMore(true));
    dispatch(searchMyItem('', onMe.offSet, false, 6));
  };

  useEffect(() => {
    if (role === 'root' || role === 'admin') {
      setList(
          companyItemList.filter(
              item => !item.is_bun && !item.repair && item.transfer === null,
          ),
      );
    } else {
      setList(
          companyItemList.filter(item =>
              item.person &&
              (!item.is_bun && !item.repair && item.transfer === null)
                  ? item.person._id === userId
                  : '',
          ),
      );
    }}, [companyItemList]);
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
      <Appbar
        navigation={props.navigation}
        pageToChosenItem="OnMeInfo"
        list={list}
        listAction={searchMyCompanyItems}
        arrow={true}
        newScan={true}
        goTo={'Home'}
        title={T.t('who_i')}
        search={true}
        filter={true}
        onMe={true}
      />
      <OnMeSearched navigation={props.navigation}/>

    </>
  );
};

const styles = StyleSheet.create({
  body: {
    position:'absolute',
    zIndex:-10,
    width: Dimensions.get('window').width,
    marginTop: -10,

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

export default OnMe;
