import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import T from '../../i18n';
// components
import Appbar from '../../components/Appbar';
import DarkButton from '../../components/Buttons/DarkButton';
import TransparentButton from '../../components/Buttons/TransparentButton';
import {Portal, ActivityIndicator} from 'react-native-paper';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  loader,
  getUserList,
  getBidList,
  getTransfers,
} from '../../actions/actions.js';
import {nfc} from "../../actions/actions";
import MoveScaner from "./MoveToObject/MoveScaner";
import MoveStartPage from "./MoveToObject/MoveStartPage";
import {openMoveScan, setIsAddMove, setIsMoveScan, setIsRoleAllowThunk} from "../../actions/moveToObjectsActions";

const AcceptGive = props => {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState();
  const settings = useSelector(state => state.settings);
  useEffect(()=>{
    dispatch(setIsMoveScan(false));
    dispatch(setIsRoleAllowThunk(false));
  },[])
  useEffect(() => {
    AsyncStorage.getItem('userId').then(id => setUserId(id));
  }, [userId]);

  const bidList = () => {
    AsyncStorage.getItem('userId').then(id => {
      dispatch(loader(true));
      dispatch(getBidList(props.navigation, id, 0));
    });
  };

  const userList = () => {
    dispatch(loader(true));
    dispatch(getUserList(props.navigation, '', 'GiveList'));
  };

  const transfers = () => {
    AsyncStorage.getItem('userId').then(id => {
      dispatch(loader(true));
      dispatch(getTransfers(props.navigation, id, 0));
    });
  };
  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        newScan={true}
        goTo={'Home'}
        title={T.t('give_accept_title')}
      />
      <SafeAreaView />
      <Portal>
        {settings.loader && (
          <View style={styles.loader}>
            <ActivityIndicator
              style={styles.load}
              size={80}
              animating={true}
              color={'#EDF6FF'}
            />
          </View>
        )}
      </Portal>
      <View style={styles.body}>
        <View style={styles.buttons}>
          <View style={styles.buttonBlock}>
            <DarkButton text={T.t('accept')} onPress={bidList} />
            <DarkButton text={T.t('give')} onPress={userList} />
            <DarkButton text={T.t('move_item')} onPress={() => {
              dispatch(openMoveScan(props.navigation, settings.moveScanPage));
              dispatch(setIsAddMove(false));

            }} />
          </View>
        </View>
        <View style={styles.BottomButton}>
          <View style={styles.buttonBlock}>
            <TransparentButton
              text={T.t('history_of_transfer')}
              onPress={() => transfers()}
            />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    marginTop: -10,
    display: 'flex',
    paddingTop: 25,
    alignItems: 'center',
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height,
  },
  title: {
    color: '#fff',
  },
  buttonBlock: {
    width: Dimensions.get('window').height / 3.3,
    textAlign: 'center',
  },
  button: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  buttonStyle: {
    width: Dimensions.get('window').width / 1.5,
    height: Dimensions.get('window').height / 15,
  },
  buttons: {
    top: Dimensions.get('window').height / 3,
  },
  BottomButton: {
    position: 'absolute',
    bottom: 140,
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  loader: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: Dimensions.get('window').height / 9,
    zIndex: 99,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default AcceptGive;
