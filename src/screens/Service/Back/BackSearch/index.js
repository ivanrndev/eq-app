import React from 'react';
import Search from '../../../../components/Search';
import {useSelector} from 'react-redux';
import {searchMyCompanyItems} from '../../../../actions/actions';

const BackSearch = ({setIsSearchOpen}) => {
  const [companyItemList] = useSelector(({companyItems}) => [
    companyItems.myCompanyList,
  ]);
  const list = companyItemList.filter(item => item.repair);

  return (
    <Search
      list={list}
      listAction={searchMyCompanyItems}
      pageToChosenItem="BackInfo"
      setIsSearchOpen={setIsSearchOpen}
    />
  );
};

export default BackSearch;
