import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Dimensions, StyleSheet, View} from 'react-native';
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

      <View style={styles.body}>
        {scaner && (
          <Scanner
            nav={props.navigation}
            page={'IdentInfo'}
            saveItems={false}
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

export default Ident;
