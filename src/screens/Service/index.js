import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Dimensions, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import T from '../../i18n';
// components
import Appbar from '../../components/Appbar';
import Scanner from '../../components/Scanner';
import {useSelector} from 'react-redux';
import {searchMyCompanyItems} from '../../actions/actions';

const Service = props => {
  const [scaner, setScaner] = useState(false);
  const companyItemList = useSelector(
    ({companyItems}) => companyItems.myCompanyList,
  );
  useFocusEffect(
    useCallback(() => {
      setScaner(true);
      return () => setScaner(false);
    }, []),
  );

  return (
    <>
        <View style={{backgroundColor: 'rgb(0,0,0)', flex:1}}>
          <Appbar
            navigation={props.navigation}
            arrow={true}
            newScan={true}
            goTo={'ServiceMenu'}
            title={T.t('send_service')}
            switch={true}
            typeSwitchNFC={true}
            search={true}
            list={companyItemList}
            listAction={searchMyCompanyItems}
            pageToChosenItem="ServiceInfo"
          />
          <SafeAreaView />
          <View>
              <Text style={styles.textStyle}>{T.t('title_scan')}</Text>
          </View>
          <View style={styles.body}>
            {scaner && (
              <Scanner
                nav={props.navigation}
                page={'ServiceInfo'}
                saveItems={false}
              />
            )}
          </View>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#fff',
  },
  input: {
    marginBottom: 10,
    marginTop: 10,
    width: Dimensions.get('window').width / 1.3,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 13,
    color: '#fff',
    textAlign: 'right',
    width: Dimensions.get('window').width / 1.3,
  },
  button: {
    marginTop: 30,
  },
  snackbar: {},

    textStyle:{
        color:'rgb(255,255,255)',
        fontSize: 30,
        position:'absolute',
        left:Dimensions.get('window').width / 5,
    },
});

export default Service;
