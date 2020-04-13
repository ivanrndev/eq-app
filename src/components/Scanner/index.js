import React, {useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {RNCamera} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {TextInput, Portal, Button, Dialog} from 'react-native-paper';
import {minY, maxY, minX, maxX} from '../../utils/markerParams.js';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {currentScan, dialogInput} from '../../actions/actions.js';

const Scanner = props => {
  const dispatch = useDispatch();
  const store = useSelector(state => state.scan);
  const [isFlash, setFlashMode] = useState(false);
  const [customId, setCustomId] = useState('');

  const onSuccess = e => {
    if (store.isNewScan) {
      dispatch(currentScan(e.data, props.nav, props.page, props.saveItems));
    }
  };

  return (
    <>
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
              <Dialog
                visible={store.dialogInput}
                onDismiss={() => dispatch(dialogInput(!store.dialogInput))}>
                <Dialog.Title>Введитее идентификатор</Dialog.Title>
                <Dialog.Content>
                  <TextInput
                    onChangeText={e => setCustomId(e.trim().toLowerCase())}
                    style={styles.input}
                    label="ТМЦ"
                    mode="flat"
                  />
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    onPress={() =>
                      dispatch(
                        currentScan(
                          customId,
                          props.nav,
                          props.page,
                          props.saveItems,
                        ),
                      )
                    }>
                    Найти
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
            <View style={styles.buttons}>
              <Button
                style={styles.button}
                contentStyle={styles.buttonStyle}
                mode="contained"
                color="#3a6fdb"
                onPress={() => dispatch(dialogInput(!store.dialogInput))}>
                Ввести код вручную
              </Button>
              <Button
                style={styles.button}
                contentStyle={styles.buttonStyle}
                mode="contained"
                color="#3a6fdb"
                onPress={() => setFlashMode(!isFlash)}>
                Освещение
              </Button>
            </View>
          </View>
        }
      />
      <View style={styles.min} />
      <View style={styles.max} />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
    marginTop: 10,
    width: Dimensions.get('window').width / 1.4,
    backgroundColor: '#fff',
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
});

export default Scanner;
