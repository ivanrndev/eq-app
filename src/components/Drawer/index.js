import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Linking,
  Share,
} from 'react-native';
import {Button} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import {useDispatch} from 'react-redux';
import {logOut} from '../../actions/actions.js';

const CustomDrawer = props => {
  const dispatch = useDispatch();
  const [role, setRole] = useState();
  const [email, setEmail] = useState();
  const [lastName, setLastName] = useState();
  const [firstName, setFirstName] = useState();

  AsyncStorage.getItem('role').then(myRole => setRole(myRole));
  AsyncStorage.getItem('email').then(myEmail => setEmail(myEmail));
  AsyncStorage.getItem('lastName').then(myLastName => setLastName(myLastName));
  AsyncStorage.getItem('firstName').then(myFirstName =>
    setFirstName(myFirstName),
  );

  const ifRole = role === 'user' || role === 'worker' ? false : true;
  const handelShare = async () => {
    try {
      const result = await Share.share({
        title: 'EqMan',
        message: 'EqMan | http://eqman.co/',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <SafeAreaView />
      <View style={styles.user}>
        <Text style={styles.title}>{`${firstName} ${lastName}`}</Text>
        <Text style={styles.text}>{email}</Text>
      </View>
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
          Админ панель
        </Button>
      )}
      <Button
        style={styles.buttton}
        contentStyle={styles.contentButton}
        icon="settings"
        color="#22215B"
        mode="outlined"
        onPress={() => {}}>
        Настройки
      </Button>
      <Button
        style={styles.buttton}
        contentStyle={styles.contentButton}
        icon="share"
        color="#22215B"
        mode="outlined"
        onPress={handelShare}>
        Поделиться
      </Button>
      <Button
        style={styles.butttonBotttom}
        contentStyle={styles.contentButton}
        icon="logout"
        color="#22215B"
        mode="outlined"
        onPress={() => dispatch(logOut(props.navigation))}>
        Выход
      </Button>
    </>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  user: {
    height: Dimensions.get('window').height / 10,
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
  buttton: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    fontSize: 13,
    width: '100%',
    borderRadius: 0,
  },
  butttonBotttom: {
    position: 'absolute',
    bottom: 30,
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    fontSize: 13,
    width: '100%',
    borderRadius: 0,
  },
  contentButton: {
    height: Dimensions.get('window').height / 18,
    width: Dimensions.get('window').width / 1.47,
  },
});
