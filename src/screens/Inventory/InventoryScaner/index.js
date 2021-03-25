import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Dimensions, SafeAreaView, StyleSheet, View} from 'react-native';
import T from '../../../i18n';
// components
import Appbar from '../../../components/Appbar';
import Scanner from '../../../components/Scanner';
import {useSelector} from 'react-redux';
import {searchMyCompanyItems} from '../../../actions/actions';

const InventoryScaner = props => {
  const [scaner, setScaner] = useState(false);
  const [companyItemList, currentInventoryUser] = useSelector(
    ({companyItems, inventory}) => [
      companyItems.myCompanyList,
      inventory.currentInventoryUser,
    ],
  );
  const list = companyItemList.filter(
    item => item.responsible === currentInventoryUser,
  );
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
        goTo={'Inventory'}
        clearGiveList={true}
        title={T.t('inventori')}
        switch={true}
        typeSwitchNFC={true}
        clearInventory={true}
        pageToChosenItem="InventoryChooseMode"
      />
      <SafeAreaView />
      <View style={styles.body}>
        {scaner && (
          <Scanner
            nav={props.navigation}
            page={'InventoryChooseMode'}
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

export default InventoryScaner;
