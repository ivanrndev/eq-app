import React from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView} from 'react-native';
import {Button} from 'react-native-paper';
// components
import Appbar from '../../components/Appbar';
// redux and actions
import {useDispatch} from 'react-redux';
import {getMarkingList} from '../../actions/actions.js';

const Marking = props => {
  const dispatch = useDispatch();
  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        goTo={'Home'}
        title={'Маркировка'}
      />
      <SafeAreaView />
      <View style={styles.buttons}>
        <Button
          style={styles.button}
          mode="contained"
          color="#3a6fdb"
          onPress={() => dispatch(getMarkingList(false, props.navigation))}>
          Маркировать
        </Button>
        <Button
          style={styles.button}
          mode="contained"
          color="#3a6fdb"
          onPress={() => dispatch(getMarkingList(true, props.navigation))}>
          Перемаркировать
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#fff',
  },
  button: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    height: Dimensions.get('window').height / 15,
    alignSelf: 'center',
    marginBottom: 10,
    width: Dimensions.get('window').width / 1.5,
  },
  buttons: {
    top: Dimensions.get('window').height / 3,
  },
});

export default Marking;
