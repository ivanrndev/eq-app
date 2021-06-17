import React from 'react';
import {
  Dimensions,
  Linking,
  SafeAreaView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Button} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import {useDispatch} from 'react-redux';
import {helps, logOut} from '../../actions/actions.js';
import T from '../../i18n';
import {useUserData} from '../../hooks/useUserData';

const CustomDrawer = props => {
  const dispatch = useDispatch();

  const {role, email, lastName, firstName} = useUserData();

  const ifRole = !(role === 'user' || role === 'worker');

  const handelShare = async () => {
    try {
      const result = await Share.share({
        title: 'EqMan',
        message: 'EqMan | http://eqman.co/',
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const handelHelp = () => {
    AsyncStorage.setItem('help', '1');
    dispatch(helps(1));
    props.navigation.reset({
      routes: [{name: 'Home'}],
    });
  };

  return (
    <>
      <SafeAreaView />
      {email && (
        <View style={styles.user}>
          <Text style={styles.title}>{`${firstName} ${lastName ?? ''}`}</Text>
          <Text style={styles.text}>{email}</Text>
        </View>
      )}
      {ifRole && (
        <Button
          style={styles.buttton}
          contentStyle={styles.contentButton}
          icon="home"
          color="#22215B"
          mode="outlined"
          onPress={() => {
            Linking.openURL('http://admin.eqman.co/auth/login');
          }}>
          {T.t('admin_panel')}
        </Button>
      )}
      {email && (
        <Button
          style={styles.buttton}
          contentStyle={styles.contentButton}
          icon="settings"
          color="#22215B"
          mode="outlined"
          onPress={() => props.navigation.navigate('Settings')}>
          {T.t('settings')}
        </Button>
      )}
      <Button
        style={styles.buttton}
        contentStyle={styles.contentButton}
        icon="share"
        color="#22215B"
        mode="outlined"
        onPress={handelShare}>
        {T.t('share')}
      </Button>
      {email && (
        <>
          <Button
            style={styles.buttton}
            contentStyle={styles.contentButton}
            icon="help"
            color="#22215B"
            mode="outlined"
            onPress={handelHelp}>
            {T.t('help')}
          </Button>
          <Button
            style={styles.butttonBotttom}
            contentStyle={styles.contentButton}
            icon="logout"
            color="#ef5466"
            mode="outlined"
            onPress={() => dispatch(logOut(props.navigation))}>
            {T.t('logout')}
          </Button>
        </>
      )}
    </>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  user: {
    height: Dimensions.get('window').height / 9,
    backgroundColor: '#EDF6FF',
    padding: 20,
    display: 'flex',
  },
  text: {
    fontSize: 12,
    fontWeight: '400',
    paddingLeft: 15,
    color: 'gray',
  },
  title: {
    fontSize: 21,
    fontWeight: '400',
    paddingLeft: 15,
    color: '#22215B',
  },
  butttonBotttom: {
    position: 'absolute',
    bottom: 30,
    fontSize: 13,
    width: '100%',
    borderRadius: 0,
    borderColor: 'white',
  },
  buttton: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    fontSize: 13,
    width: '100%',
    borderRadius: 0,
    borderColor: 'white',
  },
  contentButton: {
    height: Dimensions.get('window').height / 10,
    marginTop: -Dimensions.get('window').height / 45,
    marginBottom: -Dimensions.get('window').height / 45,
    width: 280,
    display: 'flex',
    justifyContent: 'flex-start',
    paddingLeft: 20,
  },
});
