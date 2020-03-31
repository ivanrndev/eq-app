import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {StyleSheet, View, Dimensions, SafeAreaView} from 'react-native';
// components
import Appbar from '../../components/Appbar';
import Scanner from '../../components/Scanner';

const Service = props => {
  const [scaner, setScaner] = useState(false);
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
        goTo={'Home'}
        title={'Отправка в сервис'}
      />
      <SafeAreaView />
      <View style={styles.body}>
        {scaner && <Scanner nav={props.navigation} page={'ServiceInfo'} info={true} />}
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
});

export default Service;
