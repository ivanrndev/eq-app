import React, {useEffect, useState} from 'react';
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
import OnMeSearched from "./OnMeSearched";
import {searchMyCompanyItems} from "../../actions/actions";
import {useUserData} from "../../hooks/useUserData";
import {SET_FILTERS, SET_QUERY} from "../../actions/actionsType";

const OnMe = props => {

  const dispatch = useDispatch();

  const [list, setList] = useState([]);

  const { query: text } = useSelector((state) => state.filterReducer)

  const setQueryText = query => {
    dispatch({
      type: SET_QUERY,
      payload: query,
    })
  }

  const [onMe] = useSelector(
    ({onMe}) => [onMe],
  );
  const [companyItemList, currentInventoryUser] = useSelector(
      ({companyItems, inventory}) => [
        companyItems.myCompanyList,
        inventory.currentInventoryUser,
      ],
  );
  const {role, userId} = useUserData();
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

  const queryText = (query) => {
    setQueryText(query)
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
        searchItem={true}
        queryText={queryText}
      />
      <OnMeSearched queryText={text} navigation={props.navigation}/>

    </>
  );
};

export default OnMe;
