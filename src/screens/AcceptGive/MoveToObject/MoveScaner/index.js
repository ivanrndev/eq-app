import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Dimensions, SafeAreaView, StyleSheet, Text, View} from 'react-native';
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
  const [companyItemList, isAdd] = useSelector(
      ({companyItems, moveToObject}) => [
        companyItems.myCompanyList, moveToObject.isAdd,
      ],
  );

  const {role, userId} = useUserData();
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
      dispatch(setIsMoveScan(true));
  }, [])
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
          <View style={{backgroundColor: 'rgb(0,0,0)', flex:1}}>
            <Appbar
                navigation={props.navigation}
                newScan={true}
                move={true}
                arrow={true}
                search={true}
                list={companyItemList}
                listAction={searchMyCompanyItems}
                pageToChosenItem="MoveStartPage"
                isSearchForMoveItem={true}
                giveSearch={true}
                goTo={!isAdd ? 'AcceptGive' : 'MoveStartPage'}
                title={T.t('move_to_object')}
                switch={true}
                typeSwitchNFC={true}
            />
            <View >
                <Text style={styles.textStyle}>{T.t('title_scan')}</Text>
            </View>
            <View >
              {scaner && (
                  <Scanner
                      nav={props.navigation}
                      page={'MoveStartPage'}
                      saveItems={true}
                  />
              )}
            </View>
          </View>
      </>
  );
};

const styles = StyleSheet.create({
    textStyle:{
        color:'rgb(255,255,255)',
        fontSize: 30,
        position:'absolute',
        left:Dimensions.get('window').width / 5,
    },
});

export default MoveScaner;
