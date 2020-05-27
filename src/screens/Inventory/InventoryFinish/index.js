/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView} from 'react-native';
import {Title, Portal, ActivityIndicator} from 'react-native-paper';
import T from '../../../i18n';
// components
import Appbar from '../../../components/Appbar';
import {getInventoryMesageError} from '../../../utils/helpers.js';
import DarkButton from '../../../components/Buttons/DarkButton';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  loader,
  clearGiveList,
  allowNewScan,
  alreadyScanned,
  makeStocktaking,
} from '../../../actions/actions.js';

export const InventoryFinish = props => {
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settings);
  const inventory = useSelector(state => state.inventory);
  const scan = useSelector(state => state.scan);
  const [error, setError] = useState();
  const alreadyScan = inventory.inventoryScanList.filter(Boolean);

  const more = () => {
    props.navigation.navigate('InventoryScaner');
    dispatch(allowNewScan(true));
  };

  const endScan = () => {
    props.navigation.navigate('Home');
    dispatch(clearGiveList());
    dispatch(allowNewScan(true));
    dispatch(loader(true));
    dispatch(
      makeStocktaking(
        inventory.inventoryScanList.filter(Boolean),
        inventory.currentInventoryUser,
        props.navigation,
      ),
    );
  };

  useEffect(() => {
    if (scan.scanInfoError !== 'InRepair' && scan.scanInfoError !== 'IsBan') {
      setError(getInventoryMesageError(scan.scanInfoError, scan.currentScan));
    }

    let isDuplicate = false;
    isDuplicate = alreadyScan.find(item => item === scan.selectGiveId);
    if (isDuplicate) {
      setError(getInventoryMesageError('Duplicate', scan.currentScan));
    }

    if (
      !alreadyScan.includes(scan.selectGiveId) &&
      scan.scanInfoError !== 'NotFound'
    ) {
      dispatch(alreadyScanned(alreadyScan.concat(scan.selectGiveId)));
    }
  }, [scan.scanGiveList, scan.scanInfoError]);

  return (
    <>
      <Appbar
        navigation={props.navigation}
        newScan={true}
        arrow={true}
        goTo={'InventoryScaner'}
        title={T.t('inventorization')}
        alreadyScanned={true}
        clearBidList={true}
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
        <View style={styles.container}>
          <Title style={styles.title}>{T.t('scan_more')}?</Title>
          {!!error && <Title style={styles.titleError}>{error}</Title>}
          <View style={styles.buttons}>
            <View style={styles.buttonBlock}>
              <DarkButton
                text={T.t('title_inventorization_question')}
                onPress={more}
              />
              <DarkButton text={T.t('complete')} onPress={endScan} />
            </View>
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
  container: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 10,
    height: Dimensions.get('window').height / 2.1,
    paddingBottom: 10,
    paddingTop: 20,
    width: Dimensions.get('window').width / 1.1,
    backgroundColor: '#EDF6FF',
  },
  buttonBlock: {
    width: Dimensions.get('window').height / 3.3,
    textAlign: 'center',
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: Dimensions.get('window').height / 15,
  },
  title: {
    color: '#22215B',
    textAlign: 'center',
    padding: 15,
    fontSize: 21,
  },
  titleError: {
    color: '#E40B67',
    textAlign: 'center',
    padding: 30,
  },
  text: {
    fontSize: 20,
    paddingBottom: 5,
    color: 'black',
    width: Dimensions.get('window').width / 1.3,
  },
  buttons: {
    position: 'absolute',
    bottom: 10,
  },
  button: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonStyle: {
    width: Dimensions.get('window').width / 1.5,
    height: Dimensions.get('window').height / 15,
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

export default InventoryFinish;
