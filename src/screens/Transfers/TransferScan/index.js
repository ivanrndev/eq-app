import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {AppState, Dimensions, Linking, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import T from '../../../i18n';
// components
import Appbar from '../../../components/Appbar';
import Scanner from '../../../components/Scanner';
import {useDispatch, useSelector} from 'react-redux';
import {searchMyItem, setIsAvailableCameraState} from '../../../actions/actions';
import TransparentButton from '../../../components/Buttons/TransparentButton';
import {PERMISSIONS, request} from 'react-native-permissions';

const TransferScaner = props => {
  const [scaner, setScaner] = useState(false);
  const [onMeList] = useSelector(({onMe, transfers}) => [onMe.myList]);
  const isAvailableCamera = useSelector(({auth}) => auth.isAvailableCamera);
  const searchList = onMeList.filter(item => item.transfer === null);
  const dispatch = useDispatch();
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
  useFocusEffect(
    useCallback(() => {
      setScaner(true);
      return () => setScaner(false);
    }, []),
  );
  const {isHide} = useSelector(state => state.hideScanReducer);
  return (
    <>
      <View style={{backgroundColor: 'rgb(0,0,0)', flex: 1}}>
        <Appbar
          navigation={props.navigation}
          arrow={true}
          newScan={true}
          goTo={'TransfersEdit'}
          title={T.t('title_scan')}
          switch={true}
          typeSwitchNFC={true}
          search={true}
          list={searchList}
          listAction={searchMyItem}
          pageToChosenItem="TransfersEdit"
          isSearchForGiveItem={true}
          giveSearch={true}
          editTransfer={true}
        />
        <SafeAreaView />
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
        <View style={styles.body}>
          {!isHide && scaner && (
            <Scanner nav={props.navigation} page={'TransfersEdit'} saveItems={false} />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    paddingTop: 20,
    alignItems: 'center',
  },
  textStyle: {
    color: 'rgb(255,255,255)',
    fontSize: 30,
    position: 'absolute',
    width: Dimensions.get('window').width,
    textAlign: 'center',
  },
  card: {
    display: 'flex',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    height: Dimensions.get('window').height / 8,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 14,
    textTransform: 'uppercase',
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 15,
  },
  text: {
    fontSize: 13,
    color: '#fff',
    textAlign: 'right',
    width: Dimensions.get('window').width / 1.3,
  },
});

export default TransferScaner;
