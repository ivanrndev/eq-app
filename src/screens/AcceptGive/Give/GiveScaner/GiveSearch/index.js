import React from 'react';
import {useSelector} from 'react-redux';
import {searchMyItem} from '../../../../../actions/actions';
import Search from '../../../../../components/Search';

const GiveSearch = ({setIsSearchOpen}) => {
  const onMeList = useSelector(({onMe}) => onMe.myList);

  return (
    <Search
      list={onMeList}
      listAction={searchMyItem}
      pageToChosenItem="GiveListCheck"
      setIsSearchOpen={setIsSearchOpen}
      isSearchForGiveItem={true}
    />
  );
};

export default GiveSearch;
