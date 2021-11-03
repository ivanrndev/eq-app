import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Dimensions, SafeAreaView, StyleSheet, View} from 'react-native';
import T from '../../../../i18n';
// components
import Appbar from '../../../../components/Appbar';
import Scanner from '../../../../components/Scanner';
import {useDispatch, useSelector} from 'react-redux';
import MoveStartPage from "../MoveStartPage";
import {setIsMoveScan} from "../../../../actions/moveToObjectsActions";
import {searchMyCompanyItems} from "../../../../actions/actions";
import {useUserData} from "../../../../hooks/useUserData";

const MoveScaner = props => {
  const [scaner, setScaner] = useState(false);
  const [companyItemList, currentInventoryUser] = useSelector(
      ({companyItems, inventory}) => [
        companyItems.myCompanyList,
        inventory.currentInventoryUser,
      ],
  );
  const {role, userId} = useUserData();
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
      dispatch(setIsMoveScan(true));
  }, [])
  // useEffect(
  //     () =>
  //         setList(
  //             companyItemList.filter(item =>
  //                 item.person ? item.person._id === currentInventoryUser : '',
  //             ),
  //         ),
  //
  //     [companyItemList],
  // );
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
  useFocusEffect(
      useCallback(() => {
        setScaner(true);
        return () => {
          setScaner(false);
        };
      }, []),
  );

  return (
      <>
        <Appbar
            navigation={props.navigation}
            newScan={true}
            arrow={true}
            search={true}
            list={list}
            listAction={searchMyCompanyItems}
            pageToChosenItem="MoveStartPage"
            isSearchForMoveItem={true}
            giveSearch={true}
            goTo={'AcceptGive'}
            title={T.t('move_to_object')}
            switch={true}
            typeSwitchNFC={true}
        />
        <SafeAreaView />
        <View style={styles.body}>
          {scaner && (
              <Scanner
                  nav={props.navigation}
                  page={'MoveStartPage'}
                  saveItems={true}
              />
          )}
        </View>
      </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#fff',
  },
  input: {
    marginBottom: 10,
    marginTop: 10,
    width: Dimensions.get('window').width / 1.3,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 13,
    color: '#fff',
    textAlign: 'right',
    width: Dimensions.get('window').width / 1.3,
  },
  button: {
    marginTop: 30,
  },
  snackbar: {},
});

export default MoveScaner;
