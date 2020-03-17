import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {isEmpty} from 'lodash';
// utils
import {validateEmail} from '../../utils/validateEmail.js';
// redux
import {useDispatch, useSelector} from 'react-redux';
import {userPostFetch, statusError, statusLoad} from '../../actions/actions.js';
import {
  Title,
  TextInput,
  Button,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';

const Auth = props => {
  const dispatch = useDispatch();
  const store = useSelector(state => state.auth);

  useEffect(() => {
    // AsyncStorage.setItem('token', '');
    AsyncStorage.getItem('token').then(token => {
      if (!!token || store.isLogin) {
        props.navigation.navigate('Home');
      }
    });
  }, [props, store.isLogin]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handelLogin = e => setEmail(e.trim());
  const handelPass = e => setPassword(e.trim());

  const handleSubmit = () => {
    if (!isEmpty(password) && validateEmail(email)) {
      dispatch(statusLoad(true));
      dispatch(userPostFetch({email, password}));
    } else {
      dispatch(statusError(true));
    }
  };

  return (
    <>
      <View style={styles.body}>
        <Title style={styles.title}>Авторизация</Title>
        <TextInput
          onChangeText={e => handelLogin(e)}
          style={styles.input}
          label="Логин"
          mode="flat"
        />
        <TextInput
          onChangeText={e => handelPass(e)}
          secureTextEntry={true}
          style={styles.input}
          label="Пароль"
          mode="flat"
        />
        <Text style={styles.text}>Забыли пароль?</Text>
        {store.isLoad && (
          <ActivityIndicator size={'large'} animating={true} color={'white'} />
        )}
        {!store.isLoad && (
          <Button
            style={styles.button}
            icon="login"
            mode="contained"
            color="#fff"
            onPress={handleSubmit}>
            Войти
          </Button>
        )}
        <Snackbar
          style={styles.snackbar}
          visible={store.isError}
          onDismiss={() => dispatch(statusError(false))}
          action={{
            label: 'Close',
            onPress: () => dispatch(statusError(false)),
          }}>
          Неверные данные
        </Snackbar>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#3a6fdb',
    height: Dimensions.get('window').height,
  },
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

export default Auth;
