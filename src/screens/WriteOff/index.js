import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {StyleSheet, View, Dimensions, SafeAreaView, Text, Linking} from 'react-native';
import T from '../../i18n';
// components
import Appbar from '../../components/Appbar';
import Scanner from '../../components/Scanner';
import {searchMyCompanyItems} from '../../actions/actions';
import {useSelector} from 'react-redux';
import {useUserData} from '../../hooks/useUserData';
import TransparentButton from "../../components/Buttons/TransparentButton";

const WriteOff = props => {
  const [scaner, setScaner] = useState(false);
  const [list, setList] = useState(false);
  const {role, userId} = useUserData();
  const  isAvailableCamera = useSelector(({auth}) => auth.isAvailableCamera);
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
          pageToChosenItem="WriteOffInfo"
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
              page={'WriteOffInfo'}
              saveItems={false}
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
  textStyle:{
    color:'rgb(255,255,255)',
    fontSize: 30,
    position:'absolute',
    left:Dimensions.get('window').width / 5,
  },
});

export default WriteOff;
