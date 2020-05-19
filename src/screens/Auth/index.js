/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Linking,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {isEmpty} from 'lodash';
// utils
import {validateEmail} from '../../utils/validateEmail.js';
import {ucFirst} from '../../utils/helpers.js';
import DarkButton from '../../components/Buttons/DarkButton';
// redux
import {useDispatch, useSelector} from 'react-redux';
import {
  userPostFetch,
  statusError,
  statusLoad,
  logOut,
} from '../../actions/actions.js';
import {
  Title,
  TextInput,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';

const Auth = props => {
  const dispatch = useDispatch();
  const store = useSelector(state => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('Неверные данные');
  const [loginError, setLoginError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const handelLogin = e => setEmail(ucFirst(e.trim()));
  const handelPass = e => setPassword(e.trim());

  // check disabled button
  useEffect(() => {
    if (!isEmpty(password) && !isEmpty(email)) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [password, email]);

  useEffect(() => {
    // if login error
    if (store.isError) {
      if (
        store.isError === 'UserNotFound' ||
        store.isError === 'EmailUnApproved' ||
        store.isError === 'EmailMustBeUnique' ||
        store.isError === 'ValidationError'
      ) {
        setLoginError(true);
      }

      if (
        store.isError === 'PasswordIncorrect' ||
        store.isError === 'ValidationError'
      ) {
        setPasswordError(true);
      }
    }

    // if auth -> home page + role = user
    AsyncStorage.getItem('role').then(role => {
      if (
        role === 'root' ||
        role === 'worker' ||
        role === 'stockman' ||
        role === 'admin'
      ) {
        AsyncStorage.getItem('token').then(token => {
          if (!isEmpty(token)) {
            props.navigation.navigate('Home');
            dispatch(statusError(false));
          }
        });
      }
      // if don`t have company
      if (role === 'user') {
        setError('Сначала создайте компанию');
        dispatch(statusError(true));
        dispatch(logOut(props.navigation, false));
      }
    });
  }, [store.isLogin, store.isError]);

  const handleSubmit = () => {
    if (!isEmpty(password) && validateEmail(email)) {
      dispatch(statusLoad(true));
      dispatch(userPostFetch({email, password}));
    } else {
      dispatch(statusError(true));
      setPasswordError(true);
      setLoginError(true);
    }
  };

  return (
    <>
      <View style={styles.body}>
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={30}>
          <Title style={styles.title}>Авторизация</Title>
          <TextInput
            onChangeText={e => handelLogin(e)}
            style={styles.input}
            label="Логин"
            error={loginError ? true : false}
            mode="outlined"
          />
          <TextInput
            onChangeText={e => handelPass(e)}
            secureTextEntry={true}
            style={styles.input}
            label="Пароль"
            error={passwordError ? true : false}
            mode="outlined"
          />
          {store.isLoad && (
            <ActivityIndicator
              style={styles.load}
              size={'large'}
              animating={true}
              color={'white'}
            />
          )}
          {!store.isLoad && (
            <View style={styles.buttonBlock}>
              <DarkButton
                text={'Войти'}
                onPress={handleSubmit}
                disabled={disabled}
              />
            </View>
          )}
        </KeyboardAvoidingView>
        <Text style={styles.textRegister}>
          Ещё нет аккаунта?{' '}
          <Text
            onPress={() => {
              Linking.openURL('http://admin.eqman.co/auth/register');
            }}
            style={styles.textBlue}>
            Зарегистрируйся
          </Text>
        </Text>
        <Snackbar
          style={styles.snackbar}
          visible={!!store.isError}
          onDismiss={() => {
            setError('Неверные данные');
            setLoginError(false);
            setPasswordError(false);
            dispatch(statusError(false));
          }}
          action={{
            label: 'Закрыть',
            onPress: () => {
              setError('Неверные данные');
              dispatch(statusError(false));
            },
          }}>
          {error}
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
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height,
  },
  title: {
    color: '#22215B',
    fontSize: 27,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
    marginTop: 10,
    width: Dimensions.get('window').width / 1.3,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 13,
    color: '#22215B',
    textAlign: 'right',
    width: Dimensions.get('window').width / 1.3,
  },
  button: {
    marginTop: 25,
  },
  load: {
    marginTop: 15,
  },
  textRegister: {
    position: 'absolute',
    bottom: 50,
    fontSize: 14,
    color: '#22215B',
    textAlign: 'center',
  },
  textBlue: {
    color: '#137CDF',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#137CDF',
  },
  buttonBlock: {
    marginTop: 15,
    width: Dimensions.get('window').height / 2.85,
    display: 'flex',
    alignSelf: 'center',
  },
  snackbar: {
    backgroundColor: '#22215B',
  },
});

export default Auth;
