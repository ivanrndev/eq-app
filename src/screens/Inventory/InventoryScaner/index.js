import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Dimensions, Linking, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import T from '../../../i18n';
// components
import Appbar from '../../../components/Appbar';
import Scanner from '../../../components/Scanner';
import {useSelector} from 'react-redux';
import {searchMyCompanyItems} from '../../../actions/actions';
import TransparentButton from "../../../components/Buttons/TransparentButton";

const InventoryScaner = props => {
  const [scaner, setScaner] = useState(false);
  const [companyItemList, currentInventoryUser] = useSelector(
    ({companyItems, inventory}) => [
      companyItems.myCompanyList,
      inventory.currentInventoryUser,
    ],
  );
  const [list, setList] = useState([]);
  const  isAvailableCamera = useSelector(({auth}) => auth.isAvailableCamera);
  useEffect(
    () =>
      setList(
        companyItemList.filter(item =>
          item.person ? item.person._id === currentInventoryUser : '',
        ),
      ),

    [companyItemList],
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
        <View style={{backgroundColor: 'rgb(0,0,0)', flex:1}}>
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
            pageToChosenItem="InventoryChooseMode"
          />
          <SafeAreaView />
          <View>
              <Text style={styles.textStyle}>{T.t('title_scan')}</Text>
          </View>
            {!isAvailableCamera &&
            <View style={{ flex:1, justifyContent: 'center'}}>
                <Text style={{textAlign: 'center', marginHorizontal:30, color:'rgb(255,255,255)'}}>{T.t('message_for_camera_permission')}</Text>
                <View style={{width: Dimensions.get('window').height / 5,alignSelf:'center'}}>
                    <TransparentButton
                        text={T.t('open_settings')}
                        onPress={Linking.openSettings}
                    />
                </View>
            </View>
            }
            <View style={styles.body}>
            {scaner && (
              <Scanner
                nav={props.navigation}
                page={'InventoryChooseMode'}
                saveItems={true}
              />
            )}
          </View>
        </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#fff',
  },
    textStyle:{
        color:'rgb(255,255,255)',
        fontSize: 30,
        position:'absolute',
        width: Dimensions.get('window').width,
        textAlign:'center',
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
