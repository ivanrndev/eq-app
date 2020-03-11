import React, {useState, useRef} from 'react';
import {Button, Text, View, StyleSheet, Dimensions} from 'react-native';
import {RNCamera} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

const marker = { width: 200, height: 200};
const minY = (Dimensions.get('window').height / 2) - (marker.height / 2) - 50;
const maxY = (Dimensions.get('window').height / 2) + (marker.height / 2) - 50;
const minX = (Dimensions.get('window').width / 2) - (marker.width / 2);
const maxX = (Dimensions.get('window').width / 2) + (marker.width / 2);

const Scanner = (props) => {
  const { close } = props;
  const [isTorch, setFlashMode] = useState(false);
  const [isNewScan, setIsNewScan] = useState(true)

  const toggleFlashMode = React.useCallback(() => {
    setFlashMode(!isTorch);
  }, [isTorch]);

  const onSuccess = (e) => {
    for(let code of e.barcodes) {
      const {size, origin} = code.bounds;
      if(
        parseInt(origin.y + size.height) <= maxY &&
        parseInt(origin.x + size.width) <= maxX &&
        origin.y >= minY &&
        origin.x >= minX && 
        isNewScan
      ) {
          alert(code.data);
          setIsNewScan(false);
      }
    }
  };
  return (
    <>
    <QRCodeScanner
      showMarker
      vibrate={false}
      cameraStyle={styles.preview}
      markerStyle={styles.markerStyle}
      reactivate={true}
      captureAudio={false}
      cameraProps={{
        flashMode: isTorch ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off,
        ratio: '16:9',
        onGoogleVisionBarcodesDetected: onSuccess
      }}
      bottomContent={
        <View style={styles.actions}>
          <Button title="Еще раз" 
          onPress={() => { 
            setIsNewScan(true);
            alert('Новый скан', isNewScan);
           }} />
          <Button title="Close" onPress={close}/>
          <Button title="Flash" onPress={toggleFlashMode}/>
        </View>
      }
    />
    <View style={styles.min}/>
    <View style={styles.max}/>
    </>
  )
};

const styles = StyleSheet.create({
  preview: {
    height: Dimensions.get('window').height  + 47
  },
  min: {
    height: 3,
    width: maxX - minX,
    position: 'absolute',
    top: minY,
    left: minX,
    right: maxX
  },
  max: {
    height: 3,
    width: maxX - minX,
    position: 'absolute',
    top: maxY - 3,
    left: minX,
    right: maxX
  },
  markerStyle: {
    borderColor: '#eee',
    top: minY,
    height: marker.height,
    width: marker.width,
    position: 'absolute'
  },
  text: {
    textAlign: 'center',
    lineHeight: 32,
    fontSize: 17,
    color: "#fff",
  },
  actions: {
    position: 'absolute',
    bottom: 46,
    left: 0,
    right: 0
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default Scanner;
