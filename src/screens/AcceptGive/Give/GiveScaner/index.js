import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  AppState,
  Dimensions,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import T from '../../../../i18n';
// components
import Appbar from '../../../../components/Appbar';
import Scanner from '../../../../components/Scanner';
import {useDispatch, useSelector} from 'react-redux';
import {
  searchMyCompanyItems,
  searchMyItem,
  setIsAvailableCameraState,
} from '../../../../actions/actions';
import {Portal, Snackbar} from 'react-native-paper';
import {getGiveMessageError} from '../../../../utils/helpers';
import {useUserData} from '../../../../hooks/useUserData';
import TransparentButton from '../../../../components/Buttons/TransparentButton';
import {PERMISSIONS, request} from 'react-native-permissions';

const GiveScaner = props => {
  const [err, companyItemList] = useSelector(({onMe, scan, companyItems}) => [
    scan.scanInfoError,
    companyItems.myCompanyList,
  ]);

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
  const {role, userId} = useUserData();
  const [scaner, setScaner] = useState(false);
  const [isSnackBar, setIsSnackBar] = useState(false);
  const [error, setError] = useState('');

  const [list, setList] = useState([]);
  useEffect(() => {
    console.log('GIVE_Scaner====>', list);
    console.log('GIVE_Scaner_ companyItemList====>', companyItemList);
    if (role === 'root' || role === 'admin' || role === 'stockman') {
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
      return () => setScaner(false);
    }, []),
  );
  const isAvailableCamera = useSelector(({auth}) => auth.isAvailableCamera);
  useEffect(() => {
    setError(getGiveMessageError(err));
    if (err?.length > 0) {
      setIsSnackBar(true);
      setError(getGiveMessageError(err));
    }
  }, [err]);

  useEffect(() => {
    if (isSnackBar) {
      setTimeout(() => {
        setIsSnackBar(false);
        setError('');
      }, 2000);
    }
  }, [isSnackBar]);
  const {isHide} = useSelector(state => state.hideScanReducer);

  return (
    <>
      <View style={{backgroundColor: 'rgb(0,0,0)', flex: 1}}>
        <Appbar
          navigation={props.navigation}
          arrow={true}
          newScan={true}
          goTo={'GiveListCheck'}
          title={T.t('title_scan')}
          switch={true}
          typeSwitchNFC={true}
          search={true}
          list={list}
          listAction={searchMyCompanyItems}
          pageToChosenItem="GiveListCheck"
          isSearchForGiveItem={true}
          giveSearch={true}
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
            <Scanner nav={props.navigation} page={'GiveListCheck'} saveItems={true} />
          )}
        </View>
        <Portal>
          <Snackbar
            visible={isSnackBar}
            onDismiss={() => {
              setIsSnackBar(false);
            }}
            action={{
              label: T.t('close'),
              onPress: () => {
                setIsSnackBar(false);
              },
            }}>
            {error}
          </Snackbar>
        </Portal>
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
  textStyle: {
    color: 'rgb(255,255,255)',
    fontSize: 30,
    position: 'absolute',
    width: Dimensions.get('window').width,
    textAlign: 'center',
  },
});

export default GiveScaner;
