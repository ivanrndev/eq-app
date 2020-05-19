import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {
  TextInput,
  Portal,
  Dialog,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';
import {minY, maxY, minX, maxX} from '../../utils/markerParams.js';
import DarkButton from '../../components/Buttons/DarkButton/';
import TransparentButton from '../../components/Buttons/TransparentButton';

// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {currentScan, dialogInput, loader} from '../../actions/actions.js';

const Scanner = props => {
  const dispatch = useDispatch();
  const store = useSelector(state => state.scan);
  const settings = useSelector(state => state.settings);

  const [isFlash, setFlashMode] = useState(false);
  const [customId, setCustomId] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [isSnackbar, setIsSnackbar] = useState(false);
  const [errorText, setErrorText] = useState('');
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

  useEffect(() => {
    let regular = /^[a-z]{1,2}[0-9]{4,5}$/g;
    let filterId = regular.exec(customId);
    if (filterId) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [customId]);

  const text = props.text
    ? 'Введите новый идентификатор ТМЦ'
    : 'Введитее идентификатор';

  const onSuccess = e => {
    if (store.isNewScan) {
      let cyrillicRegular = /[а-яА-ЯЁё]/;
      let cyrillicFilterId = cyrillicRegular.exec(e.data);
      if (cyrillicFilterId) {
        setErrorText('Используйте только латинские буквы');
        setIsSnackbar(true);
      } else {
        let finishRegular = /^[a-z]{1,2}[0-9]{4,5}$/g;
        let finishFilterId = finishRegular.exec(e.data);
        if (finishFilterId) {
          dispatch(dialogInput(false));
          setIsSnackbar(false);
          dispatch(loader(true));
          dispatch(
            currentScan(
              finishFilterId[0],
              props.nav,
              props.page,
              props.saveItems,
            ),
          );
        } else {
          setErrorText('Неверный фомат ТМЦ');
          setIsSnackbar(true);
        }
      }
    }
  };

  const handleOnFlashMode = () => {
    setFlashMode(!isFlash);
  };

  const handelCurrentScan = () => {
    dispatch(dialogInput(false));
    dispatch(loader(true));
    dispatch(currentScan(customId, props.nav, props.page, props.saveItems));
  };

  return (
    <>
      <View style={styles.background}>
        <QRCodeScanner
          onRead={onSuccess}
          showMarker
          vibrate={false}
          cameraStyle={styles.preview}
          markerStyle={styles.markerStyle}
          reactivate={true}
          captureAudio={false}
          cameraProps={{
            flashMode: isFlash
              ? RNCamera.Constants.FlashMode.torch
              : RNCamera.Constants.FlashMode.off,
            ratio: '16:9',
          }}
          bottomContent={
            <View style={styles.actions}>
              <Portal>
                {settings.loader && (
                  <View style={styles.loader}>
                    <ActivityIndicator
                      size={80}
                      animating={true}
                      color={'#EDF6FF'}
                    />
                  </View>
                )}
                <Dialog
                  style={isOpen ? styles.dialogOpen : styles.dialogClose}
                  visible={store.dialogInput}
                  onDismiss={() => dispatch(dialogInput(!store.dialogInput))}>
                  <KeyboardAvoidingView
                    behavior="position"
                    keyboardVerticalOffset={90}>
                    <Dialog.Title style={styles.title}>{text}</Dialog.Title>
                    <Dialog.Content style={{paddingBottom: 0}}>
                      <TextInput
                        onChangeText={e => setCustomId(e.trim().toLowerCase())}
                        style={styles.input}
                        label="ТМЦ"
                        mode="outlined"
                      />
                    </Dialog.Content>
                    <Dialog.Actions style={styles.buttonFind}>
                      <View style={styles.buttonBlock}>
                        <DarkButton
                          text={'Найти'}
                          onPress={handelCurrentScan}
                          disabled={disabled}
                        />
                      </View>
                    </Dialog.Actions>
                  </KeyboardAvoidingView>
                </Dialog>
                <Snackbar
                  style={styles.snackbar}
                  visible={!!isSnackbar}
                  onDismiss={() => setIsSnackbar(false)}
                  action={{
                    label: 'Закрыть',
                    onPress: () => setIsSnackbar(false),
                  }}>
                  {errorText}
                </Snackbar>
              </Portal>
              <View style={styles.buttons}>
                <View style={styles.buttonBlock}>
                  <DarkButton
                    text={'Ввести код вручную'}
                    onPress={() => dispatch(dialogInput(!store.dialogInput))}
                  />
                  <TransparentButton
                    text={'Освещение'}
                    onPress={handleOnFlashMode}
                  />
                </View>
              </View>
            </View>
          }
        />
        <View style={styles.min} />
        <View style={styles.max} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    display: 'flex',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 0,
    width: Dimensions.get('window').width / 1.55,
    backgroundColor: '#fff',
    zIndex: 2,
  },
  buttonBlock: {
    width: Dimensions.get('window').height / 3.3,
    textAlign: 'center',
  },
  buttons: {
    bottom: 0,
  },
  button: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    height: Dimensions.get('window').height / 15,
    alignSelf: 'center',
    marginTop: 10,
    width: Dimensions.get('window').width / 1.5,
  },
  buttonStyle: {
    width: Dimensions.get('window').width / 1.5,
    height: Dimensions.get('window').height / 15,
  },
  preview: {
    marginTop: -10,
    zIndex: 1,
    height: Dimensions.get('window').height + 47,
  },
  min: {
    height: 3,
    width: maxX - minX,
    position: 'absolute',
    top: minY,
    left: minX,
    right: maxX,
  },
  max: {
    height: 3,
    width: maxX - minX,
    position: 'absolute',
    top: maxY - 3,
    left: minX,
    right: maxX,
  },
  markerStyle: {
    borderColor: '#eee',
    top: minY,
    height: 200,
    width: 200,
    position: 'absolute',
  },
  text: {
    textAlign: 'center',
    lineHeight: 32,
    fontSize: 17,
    color: '#fff',
  },
  buttonFind: {
    display: 'flex',
    justifyContent: 'center',
  },
  actions: {
    position: 'absolute',
    top: Dimensions.get('window').height / 1.7,
    height:
      Dimensions.get('window').height - Dimensions.get('window').height / 7.5,
    marginLeft: 20,
    marginRight: 20,
  },
  capture: {
    flex: 0,
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  background: {
    backgroundColor: '#EDF6FF',
  },
  dialogOpen: {
    backgroundColor: '#EDF6FF',
    marginTop: -Dimensions.get('window').height / 5,
  },
  dialogClose: {
    backgroundColor: '#EDF6FF',
  },
  title: {
    textAlign: 'center',
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

export default Scanner;
