import React, {useEffect, useState} from 'react';
import {Appbar, IconButton, Portal, Searchbar, Snackbar} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {Image, ImageBackground, StyleSheet, View, TextInput, Dimensions} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import T from '../../i18n';

import {
  allowNewScan,
  alreadyScannedBids,
  changeIsMultiple,
  changeLocationLoc,
  changeLocationMain,
  clearBidList,
  clearGiveList,
  clearInventory,
  clearMarking,
  clearTransaction,
  clearTransfer,
  clearUserAcceptBid,
  clearUserList,
  NFCforMounting,
  saveInventoryItem,
} from '../../actions/actions.js';
import Search from '../Search';
import NFC from '../../screens/NFC';
import {cleanMountItemsList} from '../../actions/mountActions';
import {clearComments} from '../../actions/commentsAction';
import {setGoBackPageGallery} from '../../actions/addItemPhotoActions';
import {cleanCreateItem} from '../../actions/createItem';
import OnMeSearch from "../../screens/OnMe/OnMeSearch";
import OnMe from "../../screens/OnMe";
import OnMeSearched from "../../screens/OnMe/OnMeSearched";
import {cleanSearchResult, myloadMore, searchItem, searchItems, setIsShowFilter} from "../../actions/actions";
import {useDebouncedCallback} from "use-debounce";


const AppbarCustom = props => {
  const dispatch = useDispatch();
  const icon = props.arrow ? 'arrow-left' : 'menu';
  const [isConnection, setIsConnection] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNFCOpen, setIsNFCOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filters = useSelector(state => state.filterReducer);

  const isShowFilter = useSelector(({onMe})=>onMe.isShowFilter)
  NetInfo.fetch().then(state => {
    if (state.isConnected) {
      setIsConnection(false);
    } else {
      setIsConnection(true);
    }
  });

  const debouncedItemSearch = useDebouncedCallback(
    // function
    (query) => {
      dispatch(myloadMore(true));

      props.queryText(query);
      dispatch(searchItem(true, {
        ...filters,
        query
      }, 0, true));
      // dispatch(searchItems(query, 0, 10));
    },
    // delay in ms
    500
  );


  const itemSearch = query => {
    setSearch(query.trim());
    debouncedItemSearch(query);
  };

  const handleItemSearch = query => {
    setSearch(query.trim());
    // dispatch(myloadMore(true));
    dispatch(props.listAction(query, 0, true));
  };

  useEffect(() => {
    if (search.length === 0) {
      setTimeout(() => dispatch(cleanSearchResult()),1000)
    }
  }, [search])

  return (
    <>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Action
          icon={icon}
          onPress={() => {
            if (props.clearUserAcceptBid) {
              dispatch(clearUserAcceptBid());
            }
            if (props.clearComments) {
              dispatch(clearComments());
            }
            if (props.clearUserList) {
              dispatch(clearUserList());
            }
            if (props.goTo === 'back') {

                if(props.cb) props.cb();
              props.navigation.goBack();
            } else {

                props.navigation.navigate(props.goTo);
            }
            if (props.newScan) {
              dispatch(allowNewScan(true));
            }
            if (props.clearTransfer) {
              dispatch(clearTransfer());
            }
            if (props.clearTransaction) {
              dispatch(clearTransaction());
            }
            if (props.clearBidList) {
              dispatch(clearBidList());
            }
            if (props.alreadyScannedBids) {
              dispatch(alreadyScannedBids([]));
            }
            if (props.backPageMount) {
              dispatch(NFCforMounting(false));
            }
            if (props.clearGiveList) {
              dispatch(clearGiveList());
            }
            if (props.alreadyScanned) {
              dispatch(saveInventoryItem([]));
            }
            if (props.clearMarking) {
              dispatch(clearMarking());
            }
            if (props.clearInventory) {
              dispatch(clearInventory());
            }
            if (props.menu) {
              props.navigation.openDrawer();
            }

            if (props.isMutiple) {
              dispatch(changeIsMultiple(false));
            }
            if (props.clearlocationMain) {
              dispatch(changeLocationMain(''));
            }
            if (props.clearlocationLoc) {
              dispatch(changeLocationLoc(''));
            }
            if (props.search) {
              setIsSearchOpen(false);
            }
            if (props.filter) {
                setIsFilterOpen(false);
            }
            if (props.switch) {
              setIsNFCOpen(false);
            }
            if (isNFCOpen) {
              dispatch(allowNewScan(true));
              dispatch(clearMarking());
            }
            if (props.clearMountList) {
              dispatch(cleanMountItemsList());
            }
            if (props.createItem) {
              dispatch(setGoBackPageGallery(''));
              dispatch(cleanCreateItem());
            }
          }}
        />
        { isSearchOpen && props.searchItem ? <Searchbar
            placeholder={T.t('search')}
            onChangeText={props.searchItem ? (val => itemSearch(val)) : (val => handleItemSearch(val))}
            value={search}
            style={styles.search}
          />:
          <Appbar.Content
            title = {isNFCOpen ? 'NFC' : props.title}
            titleStyle={styles.content}
          />}
        {props.switch && (
          <IconButton
            icon={isNFCOpen ? 'camera' : 'cast'}
            size={30}
            color="#22215B"
            onPress={() => {
              setIsNFCOpen(!isNFCOpen);
              setIsSearchOpen(false);
            }}
          />
        )}

        {props.search && !isSearchOpen && (
          <IconButton
            icon="magnify"
            size={35}
            color="#22215B"
            onPress={() => {
                setIsSearchOpen(!isSearchOpen);
                setIsFilterOpen(false);
            }}
          />
        )}
        {props.filter && (
            <IconButton
                icon={'filter'}
                size={30}
                color="#22215B"
                onPress={() => {
                    // setIsFilterOpen(true);
                    // setIsSearchOpen(false);
                    // dispatch(setIsShowFilter(true));
                    props.navigation.navigate('OnMeSearch');



                }}
            />)}
        {props.handleSelect && (
          <IconButton
            icon={
              props.rejectIds.length === 0 ? 'select-inverse' : 'select-all'
            }
            size={25}
            color="#22215B"
            onPress={props.handleSelect}
            style={styles.selectBtn}
          />
        )}
      </Appbar.Header>
        {/*{(props.onMe && isSearchOpen) && (<OnMeSearched/>)}*/}
      {isSearchOpen && !props.searchItem && (
        <Search
          list={props.list}
          filter={props.filter}
          listAction={props.listAction}
          pageToChosenItem={props.pageToChosenItem}
          setIsSearchOpen={setIsSearchOpen}
          isSearchForMoveItem={props.isSearchForMoveItem}
          isSearchForGiveItem={props.isSearchForGiveItem}
          onSelectAction={props.onSelectAction}
          editTransfer={props.editTransfer}
        />
      )}
      {isFilterOpen && (<OnMeSearch/>)}
      {isNFCOpen && <NFC />}
      <View style={styles.borderRadius} />
      <Portal>
        <Snackbar
          style={styles.snackbar}
          visible={isConnection}
          onDismiss={() => {}}
          action={() => {}}>
          {T.t('error_internet')}
        </Snackbar>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  borderRadius: {
    height: 15,
    zIndex: 99,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    backgroundColor: '#EDF6FF',
  },
  appbar: {
    backgroundColor: '#EDF6FF',
    zIndex: 99,
  },
  content: {
    color: '#22215B',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  snackbar: {
    zIndex: 100,
    backgroundColor: '#CB2B2B',
  },
  text: {
    display: 'flex',
    alignSelf: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: 15,
  },
  selectBtn: {
    marginRight: 15,
  },
  search: {
    backgroundColor: '#EDF6FF',
    flex: 1
  },
});

export default AppbarCustom;
