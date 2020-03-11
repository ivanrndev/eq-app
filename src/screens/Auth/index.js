import React, {useState} from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import {Title, TextInput, Button, Snackbar} from 'react-native-paper';

// components
import Appbar from '../../сomponents/Appbar';

const Auth = props => {
  const [visibleSnackbar, setVisibleSnackbar] = useState(true);
  const [login, setLogin] = useState(true);

  return (
    <>
      {login && <Appbar navigation={props.navigation} />}
      <View style={styles.body}>
        <Title style={styles.title}>Авторизация</Title>
        <TextInput style={styles.input} label="Логин" mode="flat" />
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          label="Пароль"
          mode="flat"
        />
        <Text style={styles.text}>Забыли пароль?</Text>
        <Button
          style={styles.button}
          icon="login"
          mode="contained"
          color="#fff"
          onPress={() => setLogin(!login)}>
          Войти
        </Button>
        <Snackbar
          style={styles.snackbar}
          visible={visibleSnackbar}
          onDismiss={() => setVisibleSnackbar(false)}
          action={{
            label: 'Close',
            onPress: () => {},
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
  snackbar: {
    position: 'absolute',
    top: 300,
    padding: 8,
    margin: 10,
    // width: Dimensions.get('window').width / 1.3,
  },
});

export default Auth;
