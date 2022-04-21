import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {AppState, Dimensions, Linking, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import T from '../../../../i18n';
// components
import Appbar from '../../../../components/Appbar';
import Scanner from '../../../../components/Scanner';
import {useDispatch, useSelector} from 'react-redux';
import MoveStartPage from '../MoveStartPage';
import {setIsMoveScan} from '../../../../actions/moveToObjectsActions';
import {searchMyCompanyItems, setIsAvailableCameraState} from '../../../../actions/actions';
import {useUserData} from '../../../../hooks/useUserData';
import TransparentButton from '../../../../components/Buttons/TransparentButton';
import {PERMISSIONS, request} from 'react-native-permissions';

const MoveScaner = props => {
  const [scaner, setScaner] = useState(false);
  const [companyItemList, isAdd] = useSelector(({companyItems, moveToObject}) => [
    companyItems.myCompanyList,
    moveToObject.isAdd,
  ]);

  const {role, userId} = useUserData();
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setIsMoveScan(true));
  }, []);

  useEffect(() => {
    if (role === 'root' || role === 'admin') {
      setList(
        companyItemList.filter(item => !item.is_bun && !item.repair && item.transfer === null),
      );
    } else {
      setList(
        companyItemList.filter(item =>
          item.person && (!item.is_bun && !item.repair && item.transfer === null)
            ? item.person._id === userId
            : '',
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
  useEffect(() => {
    const listener = AppState.addEventListener('change', status => {
      if (Platform.OS === 'ios' && status === 'active') {
        request(PERMISSIONS.IOS.CAMERA)
          .then(result => result === 'granted' && dispatch(setIsAvailableCameraState(true)))
          .catch(error => console.log(error));
      }
    });
    // return listener.remove;
  }, []);
  const isAvailableCamera = useSelector(({auth}) => auth.isAvailableCamera);
  const {isHide} = useSelector(state => state.hideScanReducer);

  return (
    <>
      <View style={{backgroundColor: 'rgb(0,0,0)', flex: 1}}>
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
        <View>
          <Text style={styles.textStyle}>{T.t('title_scan')}</Text>
        </View>
        {!isAvailableCamera && (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={{textAlign: 'center', marginHorizontal: 30, color: 'rgb(255,255,255)'}}>
              {T.t('message_for_camera_permission')}
            </Text>
            <View style={{width: Dimensions.get('window').height / 5, alignSelf: 'center'}}>
              <TransparentButton text={T.t('open_settings')} onPress={Linking.openSettings} />
            </View>
          </View>
        )}
        <View>
          {!isHide && scaner && (
            <Scanner nav={props.navigation} page={'MoveStartPage'} saveItems={true} />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    color: 'rgb(255,255,255)',
    fontSize: 30,
    position: 'absolute',
    width: Dimensions.get('window').width,
    textAlign: 'center',
  },
});

export default MoveScaner;
