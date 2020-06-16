import React, {useState} from 'react';
import {
  Dimensions,
  TouchableHighlight,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {loader, getItemsOnMe, getUserList} from '../../../actions/actions.js';
import {menuSvg} from '../../../utils/menuSvg.js';

const Button = props => {
  const dispatch = useDispatch();
  const [pressed, setPressed] = useState(false);

  const onPressButton = () => {
    if (props.getItemsOnMe) {
      dispatch(getItemsOnMe(props.nav));
    }
    if (props.route) {
      props.nav.navigate(props.route);
    }
    if (props.getUserList) {
      dispatch(getUserList(props.nav, '', 'Inventory'));
    }
    if (props.loader) {
      dispatch(loader(true));
    }
    if (props.loader) {
      dispatch(loader(true));
    }
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
        onHideUnderlay={() => setPressed(false)}
        onShowUnderlay={() => setPressed(true)}>
        <View
          style={pressed ? styles.textWhiteContainer : styles.textContainer}>
          <View style={styles.round}>{menuSvg(props.svg)}</View>
          <Text style={pressed ? styles.textPress : styles.text}>
            {props.text}
          </Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  round: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 39,
    width: 39,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
  },
  container: {
    marginTop: 2,
    height: Dimensions.get('window').height / 9,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8.5,
    borderRadius: 40,
    color: '#22215B',
  },
  textWhiteContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8.5,
    borderRadius: 10,
    backgroundColor: '#137CDF',
  },
  button: {
    backgroundColor: '#EDF6FF',
    borderRadius: 10,
  },
  buttonPress: {
    backgroundColor: '#137CDF',
    borderRadius: 10,
  },
  text: {
    backgroundColor: '#EDF6FF',
    color: '#22215B',
    paddingLeft: 14,
    textTransform: 'none',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'left',
    width: Dimensions.get('window').width / 1.4,
  },
  textPress: {
    color: '#EDF6FF',
    paddingLeft: 14,
    textTransform: 'none',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'left',
    width: Dimensions.get('window').width / 1.4,
  },
});
export default Button;
