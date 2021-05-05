import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Dimensions, SafeAreaView, StyleSheet, View} from 'react-native';
import T from '../../../../i18n';
// components
import Appbar from '../../../../components/Appbar';
import Scanner from '../../../../components/Scanner';
import {useSelector} from 'react-redux';
import {searchMyItem} from '../../../../actions/actions';
import {Portal, Snackbar} from 'react-native-paper';
import {getGiveMessageError} from '../../../../utils/helpers';

const GiveScaner = props => {
  const [onMeList, err] = useSelector(({onMe, scan}) => [
    onMe.myList,
    scan.scanInfoError,
  ]);
  const [scaner, setScaner] = useState(false);

  const [isSnackBar, setIsSnackBar] = useState(false);
  const [error, setError] = useState('');
  const list = onMeList.filter(item => item.transfer === null);
  useFocusEffect(
    useCallback(() => {
      setScaner(true);
      return () => setScaner(false);
    }, []),
  );

  useEffect(() => {
    setError(getGiveMessageError(err));
    if (err.length > 0) {
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

  return (
    <>
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
        listAction={searchMyItem}
        pageToChosenItem="GiveListCheck"
        isSearchForGiveItem={true}
        giveSearch={true}
      />
      <SafeAreaView />
      <View style={styles.body}>
        {scaner && (
          <Scanner
            nav={props.navigation}
            page={'GiveListCheck'}
            saveItems={true}
          />
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
});

export default GiveScaner;
