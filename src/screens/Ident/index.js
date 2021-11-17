import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Dimensions, StyleSheet, View, Text} from 'react-native';
import T from '../../i18n';
// components
import Appbar from '../../components/Appbar';
import Scanner from '../../components/Scanner';
import {useSelector} from 'react-redux';
import {searchMyCompanyItems, searchMyItem} from '../../actions/actions';
import {useUserData} from '../../hooks/useUserData';

const Ident = props => {
  const [companyItemList] = useSelector(({companyItems}) => [
    companyItems.myCompanyList,
  ]);
  const {role, userId} = useUserData();

  const [scaner, setScaner] = useState(false);
  const [list, setList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      setScaner(true);
      return () => setScaner(false);
    }, []),
  );

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
    }
  }, [companyItemList]);
  return (
    <>
      <View style={{backgroundColor: 'rgb(0,0,0)', flex:1}}>
        <Appbar
          navigation={props.navigation}
          newScan={true}
          arrow={true}
          goTo={'Home'}
          title={T.t('title_scan')}
          switch={true}
          typeSwitchNFC={true}
          search={true}
          list={list}
          listAction={searchMyCompanyItems}
          pageToChosenItem="IdentInfo"
        />
        <View>
          <Text style={styles.textStyle}>{T.t('title_scan')}</Text>
        </View>

        <View>
          {scaner && (
                <Scanner
                  nav={props.navigation}
                  page={'IdentInfo'}
                  saveItems={false}
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
  }
});

export default Ident;
