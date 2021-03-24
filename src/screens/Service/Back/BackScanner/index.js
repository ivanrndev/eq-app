import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Dimensions, SafeAreaView, StyleSheet, View} from 'react-native';
import T from '../../../../i18n';
// components
import Appbar from '../../../../components/Appbar';
import Scanner from '../../../../components/Scanner';
import {useSelector} from 'react-redux';
import {searchMyCompanyItems} from '../../../../actions/actions';

const BackScanner = props => {
  const [scaner, setScaner] = useState(false);
  const companyItemList = useSelector(
    ({companyItems}) => companyItems.myCompanyList,
  );
  const list = companyItemList.filter(item => item.repair);
  useFocusEffect(
    useCallback(() => {
      setScaner(true);
      return () => setScaner(false);
    }, []),
  );

  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        newScan={true}
        goTo={'ServiceMenu'}
        title={T.t('back_service')}
        switch={true}
        typeSwitchNFC={true}
        search={true}
        backFromService={true}
        list={list}
        listAction={searchMyCompanyItems}
        pageToChosenItem="BackInfo"
      />
      <SafeAreaView />
      <View style={styles.body}>
        {scaner && (
          <Scanner nav={props.navigation} page={'BackInfo'} saveItems={false} />
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

export default BackScanner;
