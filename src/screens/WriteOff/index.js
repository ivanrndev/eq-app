import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {StyleSheet, View, Dimensions, SafeAreaView} from 'react-native';
import T from '../../i18n';
// components
import Appbar from '../../components/Appbar';
import Scanner from '../../components/Scanner';
import {searchMyCompanyItems} from '../../actions/actions';
import {useSelector} from 'react-redux';
import {useUserData} from '../../hooks/useUserData';

const WriteOff = props => {
  const [scaner, setScaner] = useState(false);
  const [list, setList] = useState(false);
  const {role, userId} = useUserData();
  const companyItemList = useSelector(
    ({companyItems}) => companyItems.myCompanyList,
  );
  useEffect(() => {
    if (role === 'root' || role === 'admin') {
      setList(companyItemList);
    } else {
      setList(
        companyItemList.filter(item =>
          item.person ? item.person._id === userId : '',
        ),
      );
    }
  }, [companyItemList]);
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
        goTo={'Home'}
        title={T.t('title_scan')}
        switch={true}
        typeSwitchNFC={true}
        search={true}
        list={list}
        listAction={searchMyCompanyItems}
        pageToChosenItem="WriteOffInfo"
      />
      <SafeAreaView />
      <View style={styles.body}>
        {scaner && (
          <Scanner
            nav={props.navigation}
            page={'WriteOffInfo'}
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

export default WriteOff;
