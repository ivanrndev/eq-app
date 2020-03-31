import React from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView} from 'react-native';
import {Button, Title} from 'react-native-paper';
// components
import Appbar from '../../../components/Appbar';
import {getProperErrorMessage} from '../../../utils/getPropertyErrorMessage.js';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {allowNewScan, getMarkingList} from '../../../actions/actions.js';

export const MarkingDone = props => {
  const dispatch = useDispatch();
  const marking = useSelector(state => state.marking);
  let error = getProperErrorMessage(marking.markingErrorDone);

  const backToList = () => {
    // props.navigation.navigate('MarkingList');
    console.log('marking status', marking.marking);
    dispatch(allowNewScan(true));
    dispatch(getMarkingList(marking.marking, props.navigation));
  };

  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        goTo={'Home'}
        title={'Подтвержденние'}
      />
      <SafeAreaView />
      <View style={styles.body}>
        <View style={styles.info}>
          {!marking.markingErrorDone ? (
            <Title style={styles.title}>Успешно!</Title>
          ) : null}
          {marking.markingErrorDone ? (
            <Title style={styles.title}>{error}</Title>
          ) : null}
        </View>
        <Button
          style={styles.button}
          mode="contained"
          color="#3a6fdb"
          onPress={backToList}>
          Вернуться к Списку
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    display: 'flex',
  },
  info: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    color: 'black',
    textAlign: 'center',
    padding: 30,
  },
  text: {
    fontSize: 20,
    color: 'black',
    width: Dimensions.get('window').width / 1.3,
  },
  button: {
    display: 'flex',
    textAlign: 'center',
    top: Dimensions.get('window').height / 3,
    justifyContent: 'center',
    height: Dimensions.get('window').height / 15,
    alignSelf: 'center',
    marginTop: 10,
    width: Dimensions.get('window').width / 1.5,
  },
  snackbar: {},
});

export default MarkingDone;
