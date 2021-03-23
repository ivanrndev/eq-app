import React from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView} from 'react-native';
import {Title} from 'react-native-paper';
import T from '../../../i18n';
// components
import Appbar from '../../../components/Appbar';
import DarkButton from '../../../components/Buttons/DarkButton';

// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  clearGiveList,
  allowNewScan,
  alreadyScanned,
  changeIsMultiple,
} from '../../../actions/actions.js';

export const InventoryDone = props => {
  const dispatch = useDispatch();
  const inventory = useSelector(state => state.inventory);
  const error = inventory.inventoryError;

  const endInventory = () => {
    dispatch(changeIsMultiple(false));
    props.navigation.navigate('Home');
    dispatch(clearGiveList());
    dispatch(allowNewScan(true));
    dispatch(alreadyScanned([]));
  };

  return (
    <>
      <Appbar
        navigation={props.navigation}
        newScan={true}
        arrow={true}
        goTo={'Inventory'}
        title={T.t('inventori')}
        alreadyScannedBids={true}
        clearBidList={true}
      />
      <SafeAreaView />
      <View style={styles.body}>
        <View style={styles.container}>
          <Title style={styles.title}>{T.t('inventori_finished')}</Title>
          {!!error && (
            <Title style={styles.title}>{T.t('inventori_error')}</Title>
          )}
          <View style={styles.buttonBlock}>
            <DarkButton text={T.t('menu')} onPress={endInventory} />
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
    position: 'absolute',
    bottom: 20,
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: Dimensions.get('window').height / 15,
  },
  title: {
    color: '#22215B',
    fontSize: 21,
    textAlign: 'center',
    padding: 30,
  },
  text: {
    fontSize: 20,
    paddingBottom: 5,
    color: 'black',
    width: Dimensions.get('window').width / 1.3,
  },
});

export default InventoryDone;
