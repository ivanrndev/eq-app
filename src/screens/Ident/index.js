import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Dimensions, StyleSheet, View, Text, Button, Linking, AppState} from 'react-native';
import T from '../../i18n';

// components
import Appbar from '../../components/Appbar';
import Scanner from '../../components/Scanner';
import {useDispatch, useSelector} from 'react-redux';
import {searchMyCompanyItems, searchMyItem, setIsAvailableCameraState} from '../../actions/actions';
import {useUserData} from '../../hooks/useUserData';
import TransparentButton from "../../components/Buttons/TransparentButton";
import {check, PERMISSIONS, request, RESULTS} from "react-native-permissions";

const Ident = props => {
  const [companyItemList, isAvailableCamera] = useSelector(({companyItems, auth}) => [
    companyItems.myCompanyList,
    auth.isAvailableCamera
  ]);
  const dispatch = useDispatch();
  useEffect(() => {
    const listener = AppState.addEventListener('change', (status) => {
      if (Platform.OS === 'ios' && status === 'active') {
        request(PERMISSIONS.IOS.CAMERA)
            .then((result) => result === "granted" && dispatch(setIsAvailableCameraState(true)))
            .catch((error) => console.log(error))

      }
    });
    // return listener.remove;
  }, []);
  const {role, userId} = useUserData();
  const [scaner, setScaner] = useState(false);
  const [list, setList] = useState([]);

  const { isHide } = useSelector(state => state.hideScanReducer)
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
          hideScanner={() => dispatch(myActionToHideScaner())}
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
        <View>
          {!isHide && scaner && (
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
    width: Dimensions.get('window').width,
    textAlign:'center',
  }
});

export default Ident;
