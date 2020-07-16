import React from 'react';
import {
  SafeAreaView,
  Dimensions,
  StyleSheet,
  View,
  Linking,
} from 'react-native';
import Appbar from '../../components/Appbar';
import {Title} from 'react-native-paper';
import T from '../../i18n';
import DarkButton from '../../components/Buttons/DarkButton';
import {useDispatch} from 'react-redux';
import {logOut} from '../../actions/actions.js';

const Subscribe = props => {
  const dispatch = useDispatch();

  const changeUsser = () => {
    dispatch(logOut(props.navigation, 'Auth'));
  };

  const selectPlan = () => {
    Linking.openURL('http://admin.eqman.co/auth/login');
  };

  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={false}
        newScan={false}
        menu={false}
        goTo={'Home'}
        title={T.t('subscription')}
      />
      <SafeAreaView />
      <View style={styles.body}>
        <View style={styles.container}>
          <View style={styles.info}>
            <Title style={styles.title}>{T.t('subscribe_end')}</Title>
          </View>
          <View style={styles.buttonsBlock}>
            <View style={styles.buttonBlock}>
              <DarkButton text={T.t('choise_plan')} onPress={selectPlan} />
              <DarkButton text={T.t('change_users')} onPress={changeUsser} />
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    display: 'flex',
    marginTop: -15,
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height,
  },
  container: {
    backgroundColor: '#EDF6FF',
    borderRadius: 10,
    height: Dimensions.get('window').height / 1.3,
    margin: 20,
    marginTop: 35,
    paddingBottom: 20,
  },
  button: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonBlock: {
    width: Dimensions.get('window').width / 1.5,
  },
  buttonsBlock: {
    position: 'absolute',
    display: 'flex',
    alignSelf: 'center',
    bottom: 20,
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: Dimensions.get('window').height / 30,
  },
  title: {
    color: '#7A7A9D',
    textAlign: 'center',
    padding: 30,
  },
});

export default Subscribe;
