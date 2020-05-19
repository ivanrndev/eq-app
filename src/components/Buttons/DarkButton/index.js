import React, {useState} from 'react';
import {
  Dimensions,
  TouchableHighlight,
  StyleSheet,
  View,
  Text,
} from 'react-native';

const DarkButton = props => {
  const [pressed, setPressed] = useState(false);
  const handleUnderlay = () => setPressed(!pressed);

  const pressedStateClasses = pressed ? styles.buttonPress : styles.button;
  const disabledStateClasses = props.disabled ? styles.disabled : styles.button;

  const pressedText = pressed ? styles.textPress : styles.text;
  const disabledText = props.disabled ? styles.disabledText : styles.text;

  const onPressButton = () => {
    if (props.onPress) {
      props.onPress();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight
        disabled={props.disabled}
        activeOpacity={1}
        style={{...pressedStateClasses, ...disabledStateClasses}}
        onPress={onPressButton}
        onHideUnderlay={handleUnderlay}
        onShowUnderlay={handleUnderlay}>
        <View
          style={pressed ? styles.textWhiteContainer : styles.textContainer}>
          <Text style={{...pressedText, ...disabledText}}>{props.text}</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height / 13,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    padding: 15,
    borderRadius: 40,
  },
  textWhiteContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#2D2C71',
  },
  button: {
    backgroundColor: '#22215B',
    borderRadius: 10,
    borderColor: '#22215B',
    borderWidth: 2,
    width: '100%',
  },
  disabled: {
    backgroundColor: '#C5CDD5',
    borderColor: '#C5CDD5',
  },
  buttonPress: {
    backgroundColor: '#137CDF',
    borderRadius: 10,
    borderColor: '#2D2C71',
    borderWidth: 2,
    width: '100%',
  },
  text: {
    height: 25,
    color: '#EDF6FF',
    textTransform: 'none',
    fontSize: 18,
    fontWeight: '300',
    textAlign: 'center',
    width: '100%',
  },
  textPress: {
    backgroundColor: '#2D2C71',
    color: '#EDF6FF',
    height: 25,
    textTransform: 'none',
    fontSize: 18,
    fontWeight: '300',
    textAlign: 'center',
    width: '100%',
  },
  disabledText: {
    color: '#ffffff',
    backgroundColor: '#C5CDD5',
  },
});
export default DarkButton;
