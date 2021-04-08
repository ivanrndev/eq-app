import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Dimensions, SafeAreaView, StyleSheet, View} from 'react-native';
import T from '../../../i18n';
// components
import Appbar from '../../../components/Appbar';
import Scanner from '../../../components/Scanner';
import {useSelector} from 'react-redux';
import {searchMyItem} from '../../../actions/actions';

const TransferScaner = props => {
  const [scaner, setScaner] = useState(false);
  const [onMeList] = useSelector(({onMe, transfers}) => [onMe.myList]);

  const searchList = onMeList.filter(item => item.transfer === null);

  useFocusEffect(
    useCallback(() => {
      setScaner(true);
      return () => setScaner(false);
    }, []),
  );

  return (
    <>
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
      <View style={styles.body}>
        {scaner && (
          <Scanner
            nav={props.navigation}
            page={'TransfersEdit'}
            saveItems={false}
          />
        )}
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
});

export default TransferScaner;
