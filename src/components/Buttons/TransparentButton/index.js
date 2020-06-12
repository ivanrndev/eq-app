import React, {useState} from 'react';
import {
  Dimensions,
  TouchableHighlight,
  StyleSheet,
  View,
  Text,
} from 'react-native';

const TransparentButton = props => {
  const [pressed, setPressed] = useState(false);
  const handleUnderlay = () => setPressed(!pressed);

  const onPressButton = () => {
    if (props.onPress) {
      props.onPress();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight
        activeOpacity={1}
        style={pressed ? styles.buttonPress : styles.button}
        onPress={onPressButton}
        onHideUnderlay={handleUnderlay}
        onShowUnderlay={handleUnderlay}>
        <View
          style={pressed ? styles.textWhiteContainer : styles.textContainer}>
          <Text style={pressed ? styles.textPress : styles.text}>
            <Text style={{fontSize: props.size}}>{props.text}</Text>
          </Text>
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
    borderRadius: 10,
    backgroundColor: '#D3E3F2',
  },
  textWhiteContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#D3E3F2',
  },
  button: {
    backgroundColor: '#D3E3F2',
    borderRadius: 10,
    borderColor: '#22215B',
    borderWidth: 2,
    width: '100%',
  },
  buttonPress: {
    backgroundColor: '#EDF6FF',
    borderRadius: 10,
    borderColor: '#22215B',
    borderWidth: 2,
    width: '100%',
  },
  text: {
    backgroundColor: '#D3E3F2',
    height: 20,
    color: '#22215B',
    textTransform: 'none',
    // fontSize: 18,
    fontWeight: '300',
    textAlign: 'center',
    width: '100%',
  },
  textPress: {
    color: '#22215B',
    height: 20,
    textTransform: 'none',
    // fontSize: 18,
    fontWeight: '300',
    textAlign: 'center',
    width: '100%',
  },
});
export default TransparentButton;
