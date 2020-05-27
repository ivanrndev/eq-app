import React from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView} from 'react-native';
import {Title} from 'react-native-paper';
import T from '../../../../i18n';
// components
import Appbar from '../../../../components/Appbar';
import DarkButton from '../../../../components/Buttons/DarkButton';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  alreadyScannedBids,
  clearBidList,
  allowNewScan,
} from '../../../../actions/actions.js';

export const AcceptFinish = props => {
  const dispatch = useDispatch();
  const accept = useSelector(state => state.accept);
  const error = accept.acceptError;

  const goMenu = () => {
    props.navigation.navigate('Home');
    dispatch(alreadyScannedBids([]));
    dispatch(clearBidList());
    dispatch(allowNewScan(true));
  };

  const goList = () => {
    props.navigation.navigate('AcceptGive');
    dispatch(alreadyScannedBids([]));
    dispatch(clearBidList());
    dispatch(allowNewScan(true));
  };

  return (
    <>
      <Appbar
        navigation={props.navigation}
        newScan={true}
        arrow={true}
        goTo={'Home'}
        title={T.t('title_accept_bid')}
        alreadyScannedBids={true}
        clearBidList={true}
      />
      <SafeAreaView />
      <View style={styles.body}>
        <View style={styles.container}>
          {!!error && (
            <View style={styles.info}>
              <Title style={styles.titleError}>
                {T.t('title_request_not_accepted')}
              </Title>
            </View>
          )}
          {!error && (
            <View style={styles.info}>
              <Title style={styles.title}>
                {T.t('title_request_accepted')}
              </Title>
            </View>
          )}
          {!error ? (
            <View style={styles.buttonBlock}>
              <DarkButton text={T.t('menu')} onPress={goMenu} />
            </View>
          ) : (
            <View style={styles.buttonBlock}>
              <DarkButton text={T.t('to_list')} onPress={goList} />
            </View>
          )}
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
    textAlign: 'center',
    padding: 30,
    fontSize: 21,
  },
  titleError: {
    color: '#E40B67',
    textAlign: 'center',
    padding: 30,
    fontSize: 21,
  },
  text: {
    fontSize: 20,
    paddingBottom: 5,
    color: 'black',
    width: Dimensions.get('window').width / 1.3,
  },
});

export default AcceptFinish;
