/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {SafeAreaView, Dimensions, StyleSheet, View} from 'react-native';
import Appbar from '../../components/Appbar';
import {useSelector} from 'react-redux';
import {isEmpty} from 'lodash';
import {Portal, ActivityIndicator} from 'react-native-paper';
import Button from '../../components/Buttons/Menu';

const Main = props => {
  const store = useSelector(state => state.auth);
  const settings = useSelector(state => state.settings);
  const [myRole, setMyRole] = useState();

  useEffect(() => {
    AsyncStorage.getItem('token').then(token => {
      if (isEmpty(token)) {
        props.navigation.navigate('Auth');
      }
    });
    AsyncStorage.getItem('role').then(role => setMyRole(role));
  }, [store.isLogOut]);

  return (
    <>
      <View style={styles.background}>
        <Appbar
          navigation={props.navigation}
          arrow={false}
          newScan={false}
          menu={true}
          goTo={'Home'}
          title={'EqMan'}
        />
        <View style={styles.body}>
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
          <Button
            nav={props.navigation}
            text={'Идентификация'}
            route={'Ident'}
            svg={'ident'}
          />
          <Button
            nav={props.navigation}
            text={'Маркировка'}
            route={'Marking'}
            svg={'marking'}
          />
          <Button
            nav={props.navigation}
            text={'Инвентаризация'}
            getUserList={true}
            svg={'inventory'}
          />
          <Button
            nav={props.navigation}
            text={'Принять / Выдать ТМЦ'}
            route={'AcceptGive'}
            svg={'acceptGive'}
          />
          {myRole !== 'worker' && (
            <>
              <Button
                nav={props.navigation}
                text={'Отправка/возврат из сервиса'}
                route={'ServiceMenu'}
                svg={'services'}
              />
              <Button
                nav={props.navigation}
                text={'Списание'}
                route={'WriteOff'}
                svg={'writeOff'}
              />
            </>
          )}
          <Button
            nav={props.navigation}
            text={'Мой подотчет'}
            getItemsOnMe={true}
            loader={true}
            svg={'my'}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    alignSelf: 'center',
    backgroundColor: '#D3E3F2',
    paddingTop: Dimensions.get('window').height / 70,
    height: Dimensions.get('window').height,
  },
  background: {
    backgroundColor: '#D3E3F2',
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

export default Main;
