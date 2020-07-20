/* eslint-disable no-extra-boolean-cast */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Linking,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import {isEmpty} from 'lodash';
import T from '../../i18n';
// utils
import {validateEmail, validatePhone} from '../../utils/validateEmail.js';
import {getForgotEmailMesage} from '../../utils/helpers.js';
import DarkButton from '../../components/Buttons/DarkButton';
// redux
import {useDispatch, useSelector} from 'react-redux';
import {
  forgotPassword,
  userPostFetch,
  statusError,
  statusLoad,
  logOut,
  resetPassInfo,
} from '../../actions/actions.js';
import {
  Title,
  TextInput,
  Snackbar,
  ActivityIndicator,
  Portal,
  Dialog,
  Button,
} from 'react-native-paper';

const Auth = props => {
  const dispatch = useDispatch();
  const store = useSelector(state => state.auth);
  const settings = useSelector(state => state.settings);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(T.t('access_denied'));
  const [loginError, setLoginError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [disabled, setDisabled] = useState(true);

  // reset password
  const [infoEmail, setInfoEmail] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [changeEmail, setChahgeEmail] = useState('');
  const [emailForgotError, setEmailForgotError] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [loginInfo, setLoginInfo] = useState(T.t('enter_valid'));

  const handelLogin = e => setEmail(e.trim());
  const handelPass = e => setPassword(e.trim());

  const handleSubmit = () => {
    const isPhone = validatePhone(email);
    const isEmail = validateEmail(email);

    if (isEmail) {
      setLoginInfo(T.t('email_register'));
    } else {
      setLoginInfo(T.t('enter_valid'));
    }

    if (!isEmpty(password) && (isEmail || isPhone)) {
      dispatch(statusLoad(true));
      dispatch(userPostFetch({email, password}));
    } else {
      dispatch(statusError(true));
      setPasswordError(true);
      setLoginError(true);
    }
  };

  useFocusEffect(() => {
    return () => {
      setError(T.t('access_denied'));
    };
  });

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
      if (store.isError === 'PhoneUnApproved') {
        setLoginError(true);
      }

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
            // dispatch(statusError(false));
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
  }, [store.isLoad, store.isError]);

  // detected keyboard
  const [isOpen, setIsOpen] = useState(false);
  const keyboardShowListener = useRef(null);
  const keyboardHideListener = useRef(null);
  useEffect(() => {
    keyboardShowListener.current = Keyboard.addListener('keyboardDidShow', () =>
      setIsOpen(true),
    );
    keyboardHideListener.current = Keyboard.addListener('keyboardDidHide', () =>
      setIsOpen(false),
    );
    return () => {
      keyboardShowListener.current.remove();
      keyboardHideListener.current.remove();
    };
  });

  // check forgot password
  useEffect(() => {
    setInfoEmail(
      getForgotEmailMesage(
        settings.forgot_pass_error || settings.forgot_pass_sucess,
      ),
    );
  }, [settings.forgot_pass_sucess, settings.forgot_pass_error]);

  const resetForModal = () => {
    setEmailForgotError(false);
    setIsModal(!isModal);
    setInfoEmail(false);
    dispatch(resetPassInfo());
  };

  const handelSendEmail = () => {
    const isPhone = validatePhone(changeEmail);
    const isEmail = validateEmail(changeEmail);

    if (!isEmpty(changeEmail) && (isEmail || isPhone)) {
      setEmailForgotError(false);
      dispatch(forgotPassword(changeEmail));
    } else {
      setEmailForgotError(true);
    }
  };

  return (
    <>
      <View style={styles.body}>
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={30}>
          <Title style={styles.title}>{T.t('auth')}</Title>
          <TextInput
            email={true}
            onChangeText={e => handelLogin(e)}
            style={styles.input}
            label={T.t('login')}
            error={loginError ? true : false}
            mode="outlined"
            onFocus={() => setEmailFocus(true)}
          />
          {loginInfo && (
            // <Text style={styles.infoEmail}>{T.t('enter_valid')}</Text>
            <Text style={styles.infoEmail}>{loginInfo}</Text>
          )}
          <TextInput
            onChangeText={e => handelPass(e)}
            secureTextEntry={true}
            style={styles.input}
            label={T.t('password')}
            error={passwordError ? true : false}
            mode="outlined"
            onFocus={() => setEmailFocus(false)}
          />
          <View style={styles.forgotBlock}>
            <Text style={styles.forgot} onPress={() => setIsModal(!isModal)}>
              {T.t('forgot_your_pass')}
            </Text>
          </View>
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
                text={T.t('come_in')}
                onPress={handleSubmit}
                disabled={disabled}
              />
            </View>
          )}
        </KeyboardAvoidingView>
        <Text style={styles.textRegister}>
          {T.t('registration_label')}{' '}
          <Text
            onPress={() => {
              Linking.openURL('http://admin.eqman.co/auth/register');
            }}
            style={styles.textBlue}>
            {T.t('registration_btn')}
          </Text>
        </Text>
        <Snackbar
          style={styles.snackbar}
          visible={!!store.isError}
          onDismiss={() => {
            setError(T.t('access_denied'));
            setLoginError(false);
            setPasswordError(false);
            dispatch(statusError(false));
          }}
          action={{
            label: T.t('close'),
            onPress: () => {
              setError(T.t('access_denied'));
              dispatch(statusError(false));
            },
          }}>
          {error}
        </Snackbar>
      </View>
      <View>
        <Portal>
          <Dialog
            style={isOpen ? styles.dialogOpen : styles.dialogClose}
            visible={isModal}
            onDismiss={resetForModal}>
            <>
              <Dialog.Title>
                <Title style={styles.titleForgot}>
                  {!!infoEmail
                    ? `${T.t('pass_recovery')}`
                    : `${T.t('forgot_your_pass')}`}
                </Title>
              </Dialog.Title>
              <Dialog.Content>
                <Text style={styles.titleForgotText}>
                  {!!infoEmail ? infoEmail : `${T.t('enter_valid')}`}
                </Text>
                {!infoEmail && (
                  <TextInput
                    error={emailForgotError ? true : false}
                    onChangeText={e => {
                      setEmailForgotError(false);
                      setChahgeEmail(e.trim().toLowerCase());
                    }}
                    style={styles.inputForgot}
                    mode="outlined"
                  />
                )}
              </Dialog.Content>
              <Dialog.Actions>
                {!!infoEmail ? (
                  <Button onPress={resetForModal}>{T.t('close')}</Button>
                ) : (
                  <Button onPress={handelSendEmail}>{T.t('next')}</Button>
                )}
              </Dialog.Actions>
            </>
          </Dialog>
        </Portal>
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
  titleForgot: {
    color: '#22215B',
    fontSize: 23,
    marginBottom: 20,
    textAlign: 'left',
  },
  titleForgotText: {
    marginTop: -10,
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
    marginTop: 10,
    width: Dimensions.get('window').width / 1.3,
    backgroundColor: '#fff',
  },
  inputForgot: {
    marginBottom: 10,
    marginTop: 10,
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
  forgotBlock: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  forgot: {
    fontSize: 14,
    color: '#22215B',
    textAlign: 'right',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#22215B',
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
  dialogOpen: {
    backgroundColor: '#EDF6FF',
    marginTop: -Dimensions.get('window').height / 2.4,
  },
  dialogClose: {
    backgroundColor: '#EDF6FF',
  },
  infoEmail: {
    fontSize: 13,
    color: '#22215B',
    textAlign: 'right',
    width: Dimensions.get('window').width / 1.3,
  },
});

export default Auth;
