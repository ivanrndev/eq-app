import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  View,
} from 'react-native';
import T from '../../i18n';
import {RNCamera} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {
  ActivityIndicator,
  Dialog,
  Portal,
  Snackbar,
  TextInput,
} from 'react-native-paper';
import {maxX, maxY, minX, minY} from '../../utils/mountMarkerParams.js';
import DarkButton from '../Buttons/DarkButton';
import TransparentButton from '../Buttons/TransparentButton';
import {fontSizer} from '../../utils/helpers.js';
import {isEmpty} from 'lodash';
import {
  currentScan,
  dialogInput,
  loader,
  mountCameraList,
} from '../../actions/actions.js';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';

const MountScanner = props => {
  const dispatch = useDispatch();
  const store = useSelector(state => state.scan);
  const settings = useSelector(state => state.settings);
  const listArray = settings.mountCameraList;
  const width = Dimensions.get('window').width;

  const [isFlash, setFlashMode] = useState(false);
  const [customId, setCustomId] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [isSnackbar, setIsSnackbar] = useState(false);
  const [errorText, setErrorText] = useState('');
  // detected keyboard
  const [isOpen, setIsOpen] = useState(false);
  const keyboardShowListener = useRef(null);
  const keyboardHideListener = useRef(null);
  const text = props.text ? T.t('input_detail_new') : T.t('input_detail');

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
    if (!isEmpty(customId)) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [customId]);

  const onSuccess = e => {
    let cyrillicRegular = /[??-????-??????]/;
    let cyrillicFilterId = cyrillicRegular.exec(e.data);
    if (cyrillicFilterId) {
      setErrorText(T.t('latin_info'));
      setIsSnackbar(true);
    } else {
      setIsSnackbar(false);
      let finishFilterId = e.data;
      const ifInDebou = listArray.includes(finishFilterId);
      if (!ifInDebou) {
        dispatch(mountCameraList(listArray, finishFilterId));
        dispatch(dialogInput(false));
        dispatch(loader(true));
        dispatch(
          currentScan(
            finishFilterId,
            props.nav,
            props.page,
            props.saveItems,
            true,
          ),
        );
      }
    }
  };

  const handleOnFlashMode = () => {
    setFlashMode(!isFlash);
  };

  const handelCurrentScan = () => {
    dispatch(dialogInput(false));
    dispatch(loader(true));
    dispatch(
      currentScan(customId, props.nav, props.page, props.saveItems, true),
    );
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
                        label={T.t('qr_code')}
                        mode="outlined"
                      />
                    </Dialog.Content>
                    <Dialog.Actions style={styles.buttonFind}>
                      <View style={styles.buttonBlock}>
                        <DarkButton
                          text={T.t('find')}
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
                    label: T.t('close'),
                    onPress: () => setIsSnackbar(false),
                  }}>
                  {errorText}
                </Snackbar>
              </Portal>
              <View style={styles.buttons}>
                <View style={styles.buttonBlock}>
                  <View>
                    <DarkButton
                      size={fontSizer(width)}
                      text={T.t('input_code')}
                      onPress={() => dispatch(dialogInput(!store.dialogInput))}
                    />
                  </View>
                  <TransparentButton
                    size={fontSizer(width)}
                    text={T.t('flash')}
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
    // zIndex: 1,
    // height: Dimensions.get('window').height + 47,
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
    // position: 'absolute',
    top: Dimensions.get('window').height / 1.35,
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

export default MountScanner;
